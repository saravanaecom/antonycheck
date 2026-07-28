import React from 'react';
import { Box, Avatar, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ExitToApp, ShoppingBag, Favorite, LocationOn, Lock, CardGiftcard, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const navItems = [
    { key: 'Orders', label: 'My Orders', icon: <ShoppingBag fontSize="small" /> },
    { key: 'Favorites', label: 'Favourites', icon: <Favorite fontSize="small" /> },
    { key: 'Addresses', label: 'Addresses', icon: <LocationOn fontSize="small" /> },
    { key: 'PasswordSettings', label: 'Password', icon: <Lock fontSize="small" /> },
    { key: 'ManageReferrals', label: 'Referrals', icon: <CardGiftcard fontSize="small" /> },
];

const Sidebar = ({ CustomerDetails, setActiveComponent, activeComponent }) => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';
    const customerName = CustomerDetails?.[0]?.CustomerName || 'Guest';
    const mobileNo = CustomerDetails?.[0]?.MobileNo || '';

    return (
        <Box sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            overflow: 'hidden',
        }}>
            {/* Profile Header */}
            <Box sx={{
                background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
                px: 3,
                py: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}>
                <Avatar sx={{
                    bgcolor: '#fff',
                    color: primary,
                    width: 52,
                    height: 52,
                    fontWeight: 700,
                    fontSize: 22,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                    {customerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2 }}>
                        {customerName}
                    </Typography>
                    {mobileNo && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            +91 {mobileNo}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Nav Items */}
            <List disablePadding>
                {navItems.map((item, idx) => {
                    const isActive = activeComponent === item.key;
                    return (
                        <React.Fragment key={item.key}>
                            <ListItemButton
                                onClick={() => setActiveComponent(item.key)}
                                sx={{
                                    px: 3,
                                    py: 1.5,
                                    bgcolor: isActive ? `${primary}12` : 'transparent',
                                    borderLeft: isActive ? `3px solid ${primary}` : '3px solid transparent',
                                    '&:hover': { bgcolor: `${primary}0d` },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: isActive ? primary : '#666' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? primary : '#333',
                                    }}
                                />
                            </ListItemButton>
                            {idx < navItems.length - 1 && <Divider sx={{ mx: 2, opacity: 0.5 }} />}
                        </React.Fragment>
                    );
                })}
                <Divider sx={{ mx: 2, opacity: 0.5 }} />
                <ListItemButton
                    onClick={() => setActiveComponent('Logout')}
                    sx={{ px: 3, py: 1.5, '&:hover': { bgcolor: '#fff0f0' } }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: '#e53935' }}>
                        <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Log Out"
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: '#e53935' }}
                    />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default Sidebar;
