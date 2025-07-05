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

    // Subscribe to signaling channel
    this.signalChannel = supabase
      .channel(`webrtc-signal:${this.partyId}`)
      .on('broadcast', { event: 'signal' }, (payload) => {
        this.handleSignal(payload.payload as SignalData);
      })
      .subscribe();

    // If host, wait for participants to join
    // If participant, send offer to host
    if (!this.isHost) {
      await this.connectToHost();
    }
  }

  private async connectToHost() {
    const peer = new SimplePeer({
      initiator: true,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      this.sendSignal({
        type: 'offer',
        from: this.userId,
        to: 'host',
        signal: data
      });
    });

    peer.on('stream', (stream) => {
      this.onRemoteStream('host', stream);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
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
    if (!this.stream) {
      console.error('No stream available for host');
      return;
    }

    const peer = new SimplePeer({
      initiator: false,
      trickle: true,
      stream: this.stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (signal) => {
      this.sendSignal({
        type: 'answer',
        from: this.userId,
        to: data.from,
        signal
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
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
    this.peers.forEach((peer) => {
      if (peer.destroyed === false) {
        peer.addStream(stream);
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