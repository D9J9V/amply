import { supabase } from '@/lib/supabase/client';
import SimplePeer from 'simple-peer';

export interface SignalData {
  type: 'offer' | 'answer' | 'ice-candidate';
  from: string;
  to?: string;
  signal: SimplePeer.SignalData;
}

export class WebRTCSignaling {
  private partyId: string;
  private userId: string;
  private isHost: boolean;
  private peers: Map<string, SimplePeer.Instance> = new Map();
  private stream: MediaStream | null = null;
  private signalChannel: ReturnType<typeof supabase.channel> | null = null;
  
  constructor(partyId: string, userId: string, isHost: boolean) {
    this.partyId = partyId;
    this.userId = userId;
    this.isHost = isHost;
  }

  async initialize(stream?: MediaStream) {
    if (stream) {
      this.stream = stream;
    }

    console.log('[WebRTC] Initializing signaling for', this.isHost ? 'host' : 'participant', 'with stream:', !!stream);

    // Subscribe to signaling channel
    this.signalChannel = supabase
      .channel(`webrtc-signal:${this.partyId}`)
      .on('broadcast', { event: 'signal' }, (payload) => {
        this.handleSignal(payload.payload as SignalData);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[WebRTC] Subscribed to signaling channel');
          
          // If participant, send offer to host after subscription
          if (!this.isHost) {
            // Small delay to ensure host is ready
            setTimeout(() => {
              this.connectToHost();
            }, 1000);
          }
        }
      });
  }

  private async connectToHost() {
    // Check if we already have a connection
    const existingPeer = this.peers.get('host');
    if (existingPeer && !existingPeer.destroyed) {
      console.log('[WebRTC] Already connected to host');
      return;
    }

    console.log('[WebRTC] Participant connecting to host...');
    const peer = new SimplePeer({
      initiator: true,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ],
        iceTransportPolicy: 'all',
        bundlePolicy: 'balanced',
        rtcpMuxPolicy: 'require'
      }
    });

    peer.on('signal', (data) => {
      console.log('[WebRTC] Sending offer to host');
      this.sendSignal({
        type: 'offer',
        from: this.userId,
        to: 'host',
        signal: data
      });
    });

    peer.on('stream', (stream) => {
      console.log('[WebRTC] Received stream from host');
      this.onRemoteStream('host', stream);
    });

    peer.on('connect', () => {
      console.log('[WebRTC] Connected to host!');
    });

    peer.on('error', (err) => {
      console.error('[WebRTC] Peer error:', err);
      // Clean up failed connection
      if (peer.destroyed) {
        this.peers.delete('host');
      }
    });

    peer.on('close', () => {
      console.log('[WebRTC] Connection to host closed');
      this.peers.delete('host');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (!this.isHost && this.signalChannel) {
          this.connectToHost();
        }
      }, 3000);
    });

    this.peers.set('host', peer);
  }

  private handleSignal(data: SignalData) {
    // Ignore our own signals
    if (data.from === this.userId) return;

    // Host handles offers from participants
    if (this.isHost && data.type === 'offer') {
      this.handleParticipantOffer(data);
    }
    // Participants handle answers from host
    else if (!this.isHost && data.type === 'answer' && data.to === this.userId) {
      this.handleHostAnswer(data);
    }
    // Handle ICE candidates
    else if (data.type === 'ice-candidate') {
      this.handleIceCandidate(data);
    }
  }

  private handleParticipantOffer(data: SignalData) {
    console.log('[WebRTC] Host received offer from participant:', data.from);
    
    if (!this.stream) {
      console.error('[WebRTC] No stream available for host');
      return;
    }

    // Check if we already have a peer connection for this participant
    const existingPeer = this.peers.get(data.from);
    if (existingPeer && !existingPeer.destroyed) {
      console.log('[WebRTC] Already have connection for participant:', data.from);
      // Signal the existing peer instead of creating a new one
      existingPeer.signal(data.signal);
      return;
    }

    const peer = new SimplePeer({
      initiator: false,
      trickle: true,
      stream: this.stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ],
        iceTransportPolicy: 'all',
        bundlePolicy: 'balanced',
        rtcpMuxPolicy: 'require'
      }
    });

    peer.on('signal', (signal) => {
      console.log('[WebRTC] Host sending answer to participant:', data.from);
      this.sendSignal({
        type: 'answer',
        from: this.userId,
        to: data.from,
        signal
      });
    });

    peer.on('connect', () => {
      console.log('[WebRTC] Host connected to participant:', data.from);
    });

    peer.on('error', (err) => {
      console.error('[WebRTC] Host peer error:', err);
      // Clean up failed connection
      if (peer.destroyed) {
        this.peers.delete(data.from);
      }
    });

    peer.on('close', () => {
      console.log('[WebRTC] Connection to participant closed:', data.from);
      this.peers.delete(data.from);
    });

    peer.signal(data.signal);
    this.peers.set(data.from, peer);
  }

  private handleHostAnswer(data: SignalData) {
    const peer = this.peers.get('host');
    if (peer) {
      peer.signal(data.signal);
    }
  }

  private handleIceCandidate(data: SignalData) {
    const peerId = this.isHost ? data.from : 'host';
    const peer = this.peers.get(peerId);
    if (peer && peer.destroyed === false) {
      peer.signal(data.signal);
    }
  }

  private async sendSignal(data: SignalData) {
    if (!this.signalChannel) return;
    
    await this.signalChannel.send({
      type: 'broadcast',
      event: 'signal',
      payload: data
    });
  }

  private onRemoteStream(peerId: string, stream: MediaStream) {
    // Emit event or callback to handle remote stream
    const event = new CustomEvent('remoteStream', { 
      detail: { peerId, stream } 
    });
    window.dispatchEvent(event);
  }

  async updateStream(stream: MediaStream) {
    this.stream = stream;
    
    // Update all existing peer connections with new stream
    this.peers.forEach((peer, peerId) => {
      if (peer.destroyed === false) {
        try {
          // Remove old tracks and add new ones
          // SimplePeer doesn't expose the RTCPeerConnection directly in types
          const peerWithConnection = peer as SimplePeer.Instance & { _pc?: RTCPeerConnection };
          const senders = peerWithConnection._pc?.getSenders() || [];
          senders.forEach((sender: RTCRtpSender) => {
            if (sender.track) {
              const newTrack = stream.getTracks().find(t => t.kind === sender.track!.kind);
              if (newTrack) {
                sender.replaceTrack(newTrack);
              }
            }
          });
        } catch (err) {
          console.error(`Error updating stream for peer ${peerId}:`, err);
        }
      }
    });
  }

  disconnect(peerId?: string) {
    if (peerId) {
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.destroy();
        this.peers.delete(peerId);
      }
    } else {
      // Disconnect all peers
      this.peers.forEach((peer) => {
        peer.destroy();
      });
      this.peers.clear();
      
      if (this.signalChannel) {
        supabase.removeChannel(this.signalChannel);
      }
    }
  }
}