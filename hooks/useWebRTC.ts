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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  
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
      
      // Video ref will be set by the effect that watches for stream changes
      
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
      const handleRemoteStream = async (event: CustomEvent) => {
        const { stream } = event.detail;
        console.log('[WebRTC Hook] Received remote stream:', {
          id: stream.id,
          tracks: stream.getTracks().map((t: MediaStreamTrack) => ({ kind: t.kind, enabled: t.enabled }))
        });
        
        setRemoteStream(stream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          // Try to play the video (autoplay might be blocked)
          try {
            await remoteVideoRef.current.play();
            console.log('[WebRTC Hook] Video playback started');
            setAutoplayBlocked(false);
          } catch (err) {
            console.error('[WebRTC Hook] Video autoplay failed:', err);
            setAutoplayBlocked(true);
            // Video will play when user interacts with the page
          }
        }
        
        setIsConnected(true);
        setIsConnecting(false);
      };

      window.addEventListener('remoteStream', handleRemoteStream as unknown as EventListener);

      // Initialize signaling with stream
      await signalingRef.current.initialize(stream);

      // Clean up listener on unmount
      return () => {
        window.removeEventListener('remoteStream', handleRemoteStream as unknown as EventListener);
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
    const isCurrentlyEnabled = videoTracks[0]?.enabled ?? false;
    
    videoTracks.forEach(track => {
      track.enabled = !isCurrentlyEnabled;
    });

    // Don't reset the video element srcObject when toggling
    // This maintains the stream connection
    
    console.log('[WebRTC] Video toggled:', !isCurrentlyEnabled ? 'ON' : 'OFF');
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

  // Manually start playback (for when autoplay is blocked)
  const playVideo = useCallback(async () => {
    console.log('[WebRTC Hook] playVideo called', {
      hasVideoRef: !!remoteVideoRef.current,
      hasStream: !!remoteStream,
      videoSrc: remoteVideoRef.current?.srcObject
    });
    
    if (remoteVideoRef.current && remoteStream) {
      try {
        // Ensure the stream is set on the video element
        if (remoteVideoRef.current.srcObject !== remoteStream) {
          console.log('[WebRTC Hook] Setting stream on video element before play');
          remoteVideoRef.current.srcObject = remoteStream;
        }
        
        await remoteVideoRef.current.play();
        setAutoplayBlocked(false);
        console.log('[WebRTC Hook] Video playback started manually');
      } catch (err) {
        console.error('[WebRTC Hook] Manual play failed:', err);
      }
    } else {
      console.error('[WebRTC Hook] Cannot play - missing video ref or stream');
    }
  }, [remoteStream]);

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
    setAutoplayBlocked(false);
  }, [localStream]);

  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      initializeWebRTC();
    }

    return () => {
      // Clean up without using the disconnect callback to avoid circular deps
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (signalingRef.current) {
        signalingRef.current.disconnect();
      }
    };
  }, [enabled, partyId, userId, isHost]); // Remove initializeWebRTC and disconnect from deps

  // Update video element when local stream changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Update remote video element when remote stream changes
  useEffect(() => {
    console.log('[WebRTC Hook] remoteStream effect triggered', {
      hasRemoteStream: !!remoteStream,
      hasVideoRef: !!remoteVideoRef.current,
      autoplayBlocked
    });
    
    if (remoteVideoRef.current && remoteStream) {
      console.log('[WebRTC Hook] Setting remote stream on video element in effect');
      remoteVideoRef.current.srcObject = remoteStream;
      // Ensure video plays
      remoteVideoRef.current.play()
        .then(() => {
          console.log('[WebRTC Hook] Video play succeeded in effect');
          setAutoplayBlocked(false);
        })
        .catch(err => {
          console.error('[WebRTC Hook] Video play failed in effect:', err);
          setAutoplayBlocked(true);
        });
    }
  }, [remoteStream]);

  return {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    error,
    autoplayBlocked,
    videoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    getMediaStates,
    playVideo,
    disconnect
  };
}