import React from 'react';
import { Box, Typography, TextField, Button, Avatar, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Profile = ({ customerDetails }) => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';
    const data = customerDetails?.[0] || {};

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2.5} sx={{ color: '#1a1a2e' }}>
                My Profile
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2.5, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #f0f0f0' }}>
                <Avatar sx={{ bgcolor: primary, width: 56, height: 56, fontSize: 22, fontWeight: 700 }}>
                    {data.CustomerName?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                    <Typography fontWeight={600} sx={{ color: '#1a1a2e' }}>{data.CustomerName || '—'}</Typography>
                    <Typography variant="body2" color="text.secondary">{data.Email || '—'}</Typography>
                </Box>
            </Box>

            <Box component="form" noValidate autoComplete="off">
                {[
                    { label: 'Full Name', value: data.CustomerName },
                    { label: 'Email Address', value: data.Email },
                    { label: 'Mobile Number', value: data.MobileNo },
                ].map(({ label, value }) => (
                    <Box key={label} mb={2}>
                        <Typography variant="body2" fontWeight={500} mb={0.5} sx={{ color: '#555' }}>{label}</Typography>
                        <TextField fullWidth size="small" variant="outlined" defaultValue={value || ''} />
                    </Box>
                ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ bgcolor: '#fff5f5', border: '1px solid #fecaca', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" color="error" fontWeight={500} mb={1}>
                    Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Deleting your account will remove all your orders, wallet amount and any active referral.
                </Typography>
                <Button variant="outlined" color="error" size="small" sx={{ textTransform: 'none' }}>
                    Delete Account
                </Button>
            </Box>
        </Box>
    );
};

export default Profile;
