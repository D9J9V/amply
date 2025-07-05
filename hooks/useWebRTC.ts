import { useState, useEffect, useRef, useCallback } from 'react';
import { WebRTCSignaling } from '@/lib/webrtc/signaling';

interface UseWebRTCOptions {
  partyId: string;
  userId: string;
  isHost: boolean;
  enabled?: boolean;
}

export function useWebRTC({ partyId, userId, isHost, enabled = true }: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const signalingRef = useRef<WebRTCSignaling | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize local stream for host
  const initializeLocalStream = useCallback(async () => {
    if (!isHost || !enabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera/microphone. Please check permissions.');
      throw err;
    }
  }, [isHost, enabled]);

  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async () => {
    if (!enabled || !partyId || !userId) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Initialize signaling
      signalingRef.current = new WebRTCSignaling(partyId, userId, isHost);

      // Get local stream if host
      let stream: MediaStream | undefined;
      if (isHost) {
        stream = await initializeLocalStream();
      }

      // Set up event listener for remote streams
      const handleRemoteStream = (event: CustomEvent) => {
        const { stream } = event.detail;
        setRemoteStream(stream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        
        setIsConnected(true);
        setIsConnecting(false);
      };

      window.addEventListener('remoteStream', handleRemoteStream as EventListener);

      // Initialize signaling with stream
      await signalingRef.current.initialize(stream);

      // Clean up listener on unmount
      return () => {
        window.removeEventListener('remoteStream', handleRemoteStream as EventListener);
      };
    } catch (err) {
      console.error('WebRTC initialization error:', err);
      setError('Failed to initialize video connection');
      setIsConnecting(false);
    }
  }, [enabled, partyId, userId, isHost, initializeLocalStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (!localStream) return;

    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (!localStream) return;

    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  // Get media states
  const getMediaStates = useCallback(() => {
    if (!localStream) return { audio: false, video: false };

    const audioTrack = localStream.getAudioTracks()[0];
    const videoTrack = localStream.getVideoTracks()[0];

    return {
      audio: audioTrack?.enabled ?? false,
      video: videoTrack?.enabled ?? false
    };
  }, [localStream]);

  // Clean up
  const disconnect = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (signalingRef.current) {
      signalingRef.current.disconnect();
      signalingRef.current = null;
    }

    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
  }, [localStream]);

  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      initializeWebRTC();
    }

    return () => {
      disconnect();
    };
  }, [enabled, initializeWebRTC, disconnect]);

  return {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    error,
    videoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    getMediaStates,
    disconnect
  };
}