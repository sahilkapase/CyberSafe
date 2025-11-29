import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Alert,
    Stack,
    Divider,
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

interface CyberbullyingAlertDialogProps {
    open: boolean;
    onClose: () => void;
    onReportAndBlock: () => void;
    onReportOnly: () => void;
    messageContent?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    senderName?: string;
    categories?: string[];
}

const CyberbullyingAlertDialog = ({
    open,
    onClose,
    onReportAndBlock,
    onReportOnly,
    messageContent = 'Potentially harmful content detected',
    severity = 'medium',
    senderName = 'Unknown User',
    categories = [],
    isViolator = false,
}: CyberbullyingAlertDialogProps & { isViolator?: boolean }) => {
    const getSeverityColor = () => {
        switch (severity) {
            case 'critical':
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'warning';
        }
    };

    const getSeverityIcon = () => {
        switch (severity) {
            case 'critical':
            case 'high':
                return <WarningRoundedIcon />;
            default:
                return <ShieldRoundedIcon />;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: `${getSeverityColor()}.light`,
                            color: `${getSeverityColor()}.main`,
                        }}
                    >
                        {getSeverityIcon()}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                            {isViolator ? 'Policy Violation Detected' : 'Potentially Harmful Content Detected'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isViolator
                                ? 'Your message was flagged by our safety system'
                                : 'Our AI detected concerning content in this message'}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3}>
                    {/* Severity Badge */}
                    <Box>
                        <Chip
                            label={`${severity.toUpperCase()} SEVERITY`}
                            color={getSeverityColor()}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    {/* Message Preview */}
                    <Alert severity={getSeverityColor()} icon={false}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            {isViolator ? 'Your Message:' : `Message from ${senderName}:`}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontStyle: 'italic',
                                p: 2,
                                bgcolor: 'rgba(0,0,0,0.05)',
                                borderRadius: 1,
                                mt: 1,
                            }}
                        >
                            "{messageContent}"
                        </Typography>
                    </Alert>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Detected Issues:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                {categories.map((category, index) => (
                                    <Chip
                                        key={index}
                                        label={category}
                                        size="small"
                                        variant="outlined"
                                        color={getSeverityColor()}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    {/* Safety Message */}
                    <Alert severity="info" icon={<ShieldRoundedIcon />}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            {isViolator ? 'Community Guidelines' : "You're in control"}
                        </Typography>
                        <Typography variant="body2">
                            {isViolator
                                ? 'Please review our community guidelines. Repeated violations may result in account suspension.'
                                : 'You can report this incident, block the user, or continue the conversation. Your safety is our priority.'}
                        </Typography>
                    </Alert>

                    {/* Support Link */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 2,
                            bgcolor: 'primary.light',
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                            },
                        }}
                        onClick={() => window.location.href = '/mental-health'}
                    >
                        <SupportAgentRoundedIcon />
                        <Typography variant="body2" fontWeight={600}>
                            Need support? Talk to our AI Counselor
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseRoundedIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    {isViolator ? 'Close' : 'Dismiss'}
                </Button>
                {!isViolator && (
                    <>
                        <Button
                            onClick={onReportOnly}
                            variant="outlined"
                            color="warning"
                            startIcon={<ReportRoundedIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Report Only
                        </Button>
                        <Button
                            onClick={onReportAndBlock}
                            variant="contained"
                            color="error"
                            startIcon={<BlockRoundedIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Report & Block User
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CyberbullyingAlertDialog;
