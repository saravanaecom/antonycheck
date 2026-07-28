/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { API_UpdateCustomerPassword } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';

const PasswordSettings = ({ customerDetails }) => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';
    const [fields, setFields] = useState({ old: '', new: '', confirm: '' });
    const [show, setShow] = useState({ old: false, new: false, confirm: false });
    const [message, setMessage] = useState({ text: '', error: false });

    const toggle = (key) => setShow(s => ({ ...s, [key]: !s[key] }));

    const handleUpdate = async () => {
        setMessage({ text: '', error: false });
        if (!fields.old || !fields.new || !fields.confirm) return setMessage({ text: 'All fields are required.', error: true });
        if (fields.new.length < 6) return setMessage({ text: 'New password must be at least 6 characters.', error: true });
        if (fields.new !== fields.confirm) return setMessage({ text: 'Passwords do not match.', error: true });

        try {
            const userId = localStorage.getItem("userId");
            const CId = userId ? decodeURIComponent(userId) : null;
            const response = await API_UpdateCustomerPassword(atob(CId), fields.old, fields.new, fields.confirm);
            if (response.ok) {
                setMessage({ text: 'Password updated successfully!', error: false });
                setFields({ old: '', new: '', confirm: '' });
            } else {
                setMessage({ text: response.message || 'Error updating password.', error: true });
            }
        } catch {
            setMessage({ text: 'Failed to update password. Please try again.', error: true });
        }
    };

    const fieldConfig = [
        { key: 'old', label: 'Current Password' },
        { key: 'new', label: 'New Password' },
        { key: 'confirm', label: 'Confirm New Password' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={0.5} sx={{ color: '#1a1a2e' }}>Password Settings</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Update your account password below.</Typography>

            <Box sx={{ maxWidth: 420 }}>
                {fieldConfig.map(({ key, label }) => (
                    <Box key={key} mb={2}>
                        <Typography variant="body2" fontWeight={500} mb={0.5} sx={{ color: '#555' }}>{label}</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type={show[key] ? 'text' : 'password'}
                            value={fields[key]}
                            onChange={(e) => setFields(f => ({ ...f, [key]: e.target.value }))}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => toggle(key)}>
                                            {show[key] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                ))}

                {message.text && (
                    <Typography variant="body2" sx={{ color: message.error ? '#e53935' : '#10b981', mb: 2 }}>
                        {message.text}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    onClick={handleUpdate}
                    sx={{
                        bgcolor: primary, color: '#fff', textTransform: 'none', borderRadius: 2,
                        boxShadow: 'none', px: 3, '&:hover': { bgcolor: primary, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                    }}
                >
                    Update Password
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordSettings;
