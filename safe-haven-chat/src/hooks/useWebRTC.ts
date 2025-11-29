import { useState, useRef, useCallback, useEffect } from 'react';

const STUN_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useWebRTC = (
    currentUserId: number | undefined,
    sendSignalingMessage: (receiverId: number, type: string, payload?: any) => void
) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'incoming' | 'connected' | 'ended'>('idle');
    const [remoteUserId, setRemoteUserId] = useState<number | null>(null);

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
    const pendingOffer = useRef<RTCSessionDescriptionInit | null>(null);

    const initializeMedia = useCallback(async (video: boolean = true, audio: boolean = true) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }, []);

    const createPeerConnection = useCallback((targetUserId: number) => {
        if (peerConnection.current) return peerConnection.current;

        const pc = new RTCPeerConnection(STUN_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignalingMessage(targetUserId, 'ice-candidate', { candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            if (pc.connectionState === 'connected') {
                setCallStatus('connected');
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                endCall();
            }
        };

        if (localStream) {
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
        }

        peerConnection.current = pc;
        return pc;
    }, [localStream, sendSignalingMessage]);

    const startCall = useCallback(async (targetUserId: number, isVideo: boolean = true) => {
        try {
            setRemoteUserId(targetUserId);
            setCallStatus('calling');
            setIsCallActive(true);

            const stream = await initializeMedia(isVideo, true);
            const pc = createPeerConnection(targetUserId);

            // Add tracks to PC (createPeerConnection does this if stream exists, but we just got it)
            stream.getTracks().forEach((track) => {
                // Check if track already added to avoid duplicates if createPeerConnection was called before
                const senders = pc.getSenders();
                if (!senders.find(s => s.track === track)) {
                    pc.addTrack(track, stream);
                }
            });

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            sendSignalingMessage(targetUserId, 'offer', { sdp: offer });
        } catch (error) {
            console.error('Error starting call:', error);
            endCall();
        }
    }, [initializeMedia, createPeerConnection, sendSignalingMessage]);

    const answerCall = useCallback(async (isVideo: boolean = true) => {
        if (!remoteUserId || !pendingOffer.current) return;

        try {
            setCallStatus('connected');
            setIsCallActive(true);

            const stream = await initializeMedia(isVideo, true);
            const pc = createPeerConnection(remoteUserId);

            // Add tracks
            stream.getTracks().forEach((track) => {
                const senders = pc.getSenders();
                if (!senders.find(s => s.track === track)) {
                    pc.addTrack(track, stream);
                }
            });

            await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer.current));
            pendingOffer.current = null;

            // Process any pending candidates
            while (pendingCandidates.current.length > 0) {
                const candidate = pendingCandidates.current.shift();
                if (candidate) await pc.addIceCandidate(candidate);
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sendSignalingMessage(remoteUserId, 'answer', { sdp: answer });
        } catch (error) {
            console.error('Error answering call:', error);
            endCall();
        }
    }, [remoteUserId, initializeMedia, createPeerConnection, sendSignalingMessage]);

    const handleSignal = useCallback(async (signal: any) => {
        const { type, payload, sdp, candidate, sender_id } = signal;
        const pc = peerConnection.current;

        if (type === 'offer') {
            if (callStatus === 'idle') {
                setCallStatus('incoming');
                setRemoteUserId(sender_id);
                pendingOffer.current = sdp;
            }
            return;
        }

        if (!pc) {
            if (type === 'ice-candidate' && candidate) {
                pendingCandidates.current.push(candidate);
            }
            return;
        }

        if (type === 'answer' && sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        } else if (type === 'ice-candidate' && candidate) {
            try {
                await pc.addIceCandidate(candidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        } else if (type === 'call_end') {
            endCall();
        }
    }, [callStatus]);

    const endCall = useCallback(() => {
        if (remoteUserId) {
            sendSignalingMessage(remoteUserId, 'call_end');
        }

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }

        setRemoteStream(null);
        setIsCallActive(false);
        setCallStatus('ended');
        setRemoteUserId(null);
        pendingCandidates.current = [];
        pendingOffer.current = null;
    }, [localStream, remoteUserId, sendSignalingMessage]);

    return {
        localStream,
        remoteStream,
        isCallActive,
        callStatus,
        startCall,
        answerCall,
        handleSignal,
        endCall,
    };
};
