import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Instagram, Twitter, Facebook, LinkedIn, LocationOn, Phone, Email } from '@mui/icons-material';
import AppLogo from '../logo/AppLogo';
import PlayStrore from '../../assets/play-store.svg';
import AppStrore from '../../assets/app-store.svg';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';

const AppFooter = ({ CompanyDetails }) => {
    const theme = useTheme();
    return (
        <Box sx={{ backgroundColor: '#1A1A1A', color: '#fff', pt: { xs: 8, md: 10 }, pb: 4, position: 'relative', overflow: 'hidden' }}>
            {/* Subtle background decoration */}
            <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: `radial-gradient(circle, ${theme.palette.basecolorCode.main} 0%, rgba(26,26,26,0) 70%)`, opacity: 0.15, borderRadius: '50%' }} />
            
            <Container maxWidth="xl" sx={{ px: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
                
                {/* Top Newsletter Row */}
                <Grid container spacing={4} alignItems="center" sx={{ mb: 8, pb: 6, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            Join our <span style={{ color: theme.palette.basecolorCode.main }}>Newsletter</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 450 }}>
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered directly to your inbox.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50px', p: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <TextField
                                fullWidth
                                placeholder="Enter your email address..."
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { color: '#fff', px: 2, fontSize: '1.1rem' }
                                }}
                            />
                            <Button 
                                variant="contained"
                                sx={{ 
                                    borderRadius: '40px', 
                                    backgroundColor: theme.palette.basecolorCode.main, 
                                    py: 1.5, 
                                    px: 4, 
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: theme.palette.basecolorCode.secondary || theme.palette.basecolorCode.main }
                                }}
                            >
                                Subscribe
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={6} justifyContent="space-between" alignItems="flex-start">
                    {/* Left section - Brand Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Box sx={{ background: '#fff', borderRadius: 2, p: 1, mb: 3 }}>
                                <AppLogo />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, lineHeight: 1.8 }}>
                                Delivering the freshest, highest quality premium cuts directly from farm to your kitchen. Taste the difference today.
                            </Typography>
                            <Box display="flex" gap={1.5}>
                                {[Instagram, Twitter, Facebook, LinkedIn].map((Icon, idx) => (
                                    <Box key={idx} component={Link} to="#" sx={{ 
                                        width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        color: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.basecolorCode.main,
                                            color: '#fff',
                                            transform: 'translateY(-3px)'
                                        }
                                    }}>
                                        <Icon fontSize="small" />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Middle section - Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Quick Links
                        </Typography>
                        <List sx={{ p: 0 }}>
                            {['Home', 'About Us', 'Privacy Policy', 'Terms & Conditions', 'Refund & Cancellation'].map((text, idx) => (
                                <ListItem key={idx} sx={{ p: 0, mb: 1.5 }} button component={Link} to={text === 'Home' ? '/' : `/${text.toLowerCase().replace(/ & | /g, '-')}`}>
                                    <ListItemText 
                                        primary={text} 
                                        sx={{ 
                                            margin: 0,
                                            '& span': { 
                                                color: 'rgba(255,255,255,0.7)', 
                                                transition: 'all 0.2s',
                                                fontWeight: 500,
                                                '&:hover': { color: theme.palette.basecolorCode.main, paddingLeft: '5px' }
                                            } 
                                        }} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <LocationOn sx={{ color: theme.palette.basecolorCode.main, mt: 0.5 }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{ServerURL.COMPANY_ADDRESS}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Phone sx={{ color: theme.palette.basecolorCode.main }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{ServerURL.COMPANY_MOBILE}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Email sx={{ color: theme.palette.basecolorCode.main }} />
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{ServerURL.COMPANY_EMAIL}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right section - App Download */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Download App
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button 
                                component="a" 
                                target='_blank' 
                                href='https://play.google.com/store/apps/details?id=com.webpos.healthysteps' 
                                variant="outlined" 
                                sx={{ 
                                    justifyContent: 'flex-start',
                                    borderColor: 'rgba(255,255,255,0.2)', 
                                    color: '#fff',
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 2,
                                    textTransform: 'none',
                                    '&:hover': { borderColor: theme.palette.basecolorCode.main, background: 'rgba(255,255,255,0.05)' }
                                }} 
                                startIcon={<img src={PlayStrore} alt="Play Store" width="28" style={{ marginRight: 8 }} />}
                            >
                                <Box textAlign="left">
                                    <Typography variant="caption" display="block" sx={{ lineHeight: 1, opacity: 0.7 }}>GET IT ON</Typography>
                                    <Typography variant="body1" fontWeight="bold" sx={{ lineHeight: 1, mt: 0.5 }}>Google Play</Typography>
                                </Box>
                            </Button>
                            <Button 
                                component="a" 
                                target='_blank' 
                                href='https://play.google.com/store/apps/details?id=com.webpos.healthysteps' 
                                variant="outlined" 
                                sx={{ 
                                    justifyContent: 'flex-start',
                                    borderColor: 'rgba(255,255,255,0.2)', 
                                    color: '#fff',
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 2,
                                    textTransform: 'none',
                                    '&:hover': { borderColor: theme.palette.basecolorCode.main, background: 'rgba(255,255,255,0.05)' }
                                }} 
                                startIcon={<img src={AppStrore} alt="App Store" width="28" style={{ marginRight: 8 }} />}
                            >
                                <Box textAlign="left">
                                    <Typography variant="caption" display="block" sx={{ lineHeight: 1, opacity: 0.7 }}>Download on the</Typography>
                                    <Typography variant="body1" fontWeight="bold" sx={{ lineHeight: 1, mt: 0.5 }}>App Store</Typography>
                                </Box>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Copyright */}
                <Box sx={{ mt: 8, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        © {new Date().getFullYear()} Kassapos software solutions Pvt Ltd. All rights reserved.
                    </Typography>
                    <Box display="flex" gap={3}>
                        <Typography component={Link} to="/privacy-policy" variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
                            Privacy Policy
                        </Typography>
                        <Typography component={Link} to="/terms-and-conditions" variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
                            Terms of Service
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AppFooter;
