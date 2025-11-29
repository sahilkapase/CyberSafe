import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Avatar,
    Box,
    Stack,
    IconButton
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';

interface IncomingCallDialogProps {
    open: boolean;
    callerName: string;
    callerAvatar?: string;
    callType: 'video' | 'audio';
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
    open,
    callerName,
    callerAvatar,
    callType,
    onAccept,
    onReject,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onReject}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    padding: 2,
                    minWidth: 300,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                    Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
                    <Avatar
                        src={callerAvatar}
                        sx={{ width: 80, height: 80, boxShadow: 3 }}
                    >
                        {callerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" fontWeight="600">
                        {callerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        is calling you...
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 4, pb: 2 }}>
                <Stack alignItems="center" gap={1}>
                    <IconButton
                        onClick={onReject}
                        sx={{
                            bgcolor: 'error.main',
                            color: 'white',
                            width: 56,
                            height: 56,
                            '&:hover': { bgcolor: 'error.dark' }
                        }}
                    >
                        <CallEndIcon />
                    </IconButton>
                    <Typography variant="caption" fontWeight="bold">Decline</Typography>
                </Stack>

                <Stack alignItems="center" gap={1}>
                    <IconButton
                        onClick={onAccept}
                        sx={{
                            bgcolor: 'success.main',
                            color: 'white',
                            width: 56,
                            height: 56,
                            '&:hover': { bgcolor: 'success.dark' }
                        }}
                    >
                        {callType === 'video' ? <VideocamIcon /> : <CallIcon />}
                    </IconButton>
                    <Typography variant="caption" fontWeight="bold">Accept</Typography>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default IncomingCallDialog;
