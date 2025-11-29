import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Paper, Typography, Avatar } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

interface VideoCallProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: () => void;
    isAudioOnly?: boolean;
    remoteUserName?: string;
    remoteUserAvatar?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({
    localStream,
    remoteStream,
    onEndCall,
    isAudioOnly = false,
    remoteUserName,
    remoteUserAvatar,
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(isAudioOnly);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream && !isAudioOnly) {
            localStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'black',
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Remote Video / Audio Placeholder */}
            <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isAudioOnly || !remoteStream ? (
                    <Stack alignItems="center" spacing={2}>
                        <Avatar
                            src={remoteUserAvatar}
                            sx={{ width: 120, height: 120, border: '4px solid white' }}
                        >
                            {remoteUserName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h4" color="white" fontWeight="bold">
                            {remoteUserName}
                        </Typography>
                        <Typography variant="body1" color="rgba(255,255,255,0.7)">
                            {remoteStream ? 'Connected' : 'Connecting...'}
                        </Typography>
                    </Stack>
                ) : (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </Box>

            {/* Local Video (PIP) */}
            {!isAudioOnly && !isVideoOff && (
                <Paper
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        width: 200,
                        height: 150,
                        bgcolor: 'black',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                </Paper>
            )}

            {/* Controls */}
            <Paper
                elevation={0}
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    borderRadius: 8,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    display: 'flex',
                    gap: 3,
                }}
            >
                <IconButton
                    onClick={toggleMute}
                    sx={{
                        bgcolor: isMuted ? 'white' : 'rgba(255,255,255,0.2)',
                        color: isMuted ? 'black' : 'white',
                        width: 56,
                        height: 56,
                        '&:hover': { bgcolor: isMuted ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }
                    }}
                >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>

                <IconButton
                    onClick={onEndCall}
                    sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 64,
                        height: 64,
                        '&:hover': { bgcolor: 'error.dark' }
                    }}
                >
                    <CallEndIcon sx={{ fontSize: 32 }} />
                </IconButton>

                {!isAudioOnly && (
                    <IconButton
                        onClick={toggleVideo}
                        sx={{
                            bgcolor: isVideoOff ? 'white' : 'rgba(255,255,255,0.2)',
                            color: isVideoOff ? 'black' : 'white',
                            width: 56,
                            height: 56,
                            '&:hover': { bgcolor: isVideoOff ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                    </IconButton>
                )}
            </Paper>
        </Box>
    );
};

export default VideoCall;
