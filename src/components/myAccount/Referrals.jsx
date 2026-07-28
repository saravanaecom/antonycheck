import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useTheme } from '@mui/material/styles';

const steps = [
    { num: '1', text: 'Share your referral link with a friend' },
    { num: '2', text: 'Friend places their first order — you get 25% off (up to ₹200)' },
    { num: '3', text: 'Earn ₹25 after 10 successful referrals' },
];

const Referrals = () => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';

    const handleWhatsAppInvite = () => {
        const message = encodeURIComponent('Hey! Check this out. Get % off for you');
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2.5} sx={{ color: '#1a1a2e' }}>Manage Referrals</Typography>

            {/* Banner */}
            <Paper elevation={0} sx={{
                background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
                borderRadius: 3, p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2,
            }}>
                <CardGiftcardIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.9)' }} />
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>
                        25% off for you!
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        Invite friends and earn rewards together
                    </Typography>
                </Box>
            </Paper>

            {/* How it works */}
            <Typography fontWeight={600} mb={1.5} sx={{ color: '#1a1a2e' }}>How it works</Typography>
            <Box sx={{ mb: 3 }}>
                {steps.map((step) => (
                    <Box key={step.num} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Box sx={{
                            width: 28, height: 28, borderRadius: '50%', bgcolor: `${primary}18`,
                            color: primary, fontWeight: 700, fontSize: 13,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            {step.num}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#444', pt: 0.4 }}>{step.text}</Typography>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Share Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 360 }}>
                <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    onClick={handleWhatsAppInvite}
                    sx={{
                        bgcolor: '#25D366', color: '#fff', textTransform: 'none', borderRadius: 2,
                        boxShadow: 'none', '&:hover': { bgcolor: '#1ebe5d' },
                    }}
                >
                    Invite via WhatsApp
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={handleWhatsAppInvite}
                    sx={{
                        borderColor: primary, color: primary, textTransform: 'none', borderRadius: 2,
                        '&:hover': { bgcolor: `${primary}0d`, borderColor: primary },
                    }}
                >
                    Copy Invite Link
                </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box textAlign="center" py={2}>
                <Typography variant="body2" color="text.secondary">No referrals yet. Share with friends to start saving!</Typography>
            </Box>
        </Box>
    );
};

export default Referrals;
