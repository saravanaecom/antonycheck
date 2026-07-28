/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, AppBar, Toolbar, Grid, IconButton, Button, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from '../logo/AppLogo';
import AppRegister from '../authentication/AppRegister';
import AppLogin from '../authentication/AppLogin';
import AppCart from '../cart/AppCart';
import AppForgetPassword from '../authentication/AppForgetPassword';
import AppSearchBox from './AppSearchBox';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';
import TopCategory from '../category/TopCategory';
import { Container, Box } from '@mui/material';

const drawerContent = (
  <List>
    <ListItem button component={Link} to="/">
      <AppLogo />
    </ListItem>
    <ListItem button component={Link} to="/about">
      <ListItemText primary="About Us" />
    </ListItem>
    <ListItem button component={Link} to="/privacy-policy">
      <ListItemText primary="Privacy Policy" />
    </ListItem>
    <ListItem button component={Link} to="/terms-and-conditions">
      <ListItemText primary="Terms & Conditions" />
    </ListItem>
    <ListItem button component={Link} to="/refund-cancellation">
      <ListItemText primary="Refund & Cancellation" />
    </ListItem>
  </List>
);

export default function AppHeader() {
  const theme = useTheme();
  const { isAuthenticated, setIsAuthenticated, isAuthenticatedName } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [forgetPasswordDrawerOpen, setForgetPasswordDrawerOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const {cartItems} = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen((open) => !open);
  };

  // Authentication right sidebar
  const handleAuthDrawerToggle = (event) => {
    if (event === false) {
      if (registerDrawerOpen === true) {
        setLoginDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen(false);
        setRegisterDrawerOpen((prev) => !prev);
      }
      else if (loginDrawerOpen === true) {
        setRegisterDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen(false);
        setLoginDrawerOpen((prev) => !prev);
      }
      else if (forgetPasswordDrawerOpen === true) {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setForgetPasswordDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
    else {
      const id = event.currentTarget.id;
      if (id === "register_btn") {
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setRegisterDrawerOpen((prev) => !prev);
      }
      else if (id === "login_btn") {
        setRegisterDrawerOpen(false);
        setCartDrawerOpen(false);
        setLoginDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
  };

  // Handle scroll event to animate header
  useEffect(() => {   
    setCartItemsCount(cartItems.length ? cartItems.length : 0);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cartItems]);

  return (
    <>
      <AppBar
        position={isScrolled ? 'sticky' : 'relative'}
        color="transparent"
        elevation={isScrolled ? 8 : 0}
        sx={{
          borderBottom: isScrolled ? 'none' : '1px solid rgba(0,0,0,0.1)',
          backgroundColor: isScrolled ? '#FFFFFF' : 'linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0.9))',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          zIndex: 1000,
          top: 0,
          boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
          '@media (max-width: 600px)': {
            position: 'relative',
            width: '100%',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '72px', padding: '0 16px' }}>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>

            {/* Logo Section */}
            <Grid item xs="auto" sm="auto" md="auto" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to={"/"}>
                <AppLogo sx={{ height: '48px', width: 'auto' }} />
              </Link>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.basecolorCode.main, display: { sm: 'none', md: 'flex' } }}>
                Chicken Express
              </Typography>
            </Grid>

            {/* Hamburger Menu for Mobile */}
            <Grid item xs="auto" sm="auto" md="auto" sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ padding: '8px' }}>
                <MenuIcon sx={{ width: '28px', height: '28px', color: theme.palette.text.primary }} />
              </IconButton>
            </Grid>

            {/* Search Bar Section */}
            <Grid
              item
              xs={12} sm={true} md={true}
              sx={{
                display: { xs: 'none', sm: 'flex', md: 'flex' },
                alignItems: 'center',
                flexGrow: 1,
                maxWidth: '500px',
                margin: '0 16px'
              }}
            >
              <AppSearchBox sx={{ width: '100%' }} />              
            </Grid>

            {/* Navigation and User Action Section */}
            <Grid item xs={12} sm="auto" md="auto" sx={{ display: { xs: 'none', sm: 'flex', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
              <Button 
                component={Link}
                to="/"
                sx={{ 
                  textTransform: 'none', 
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  color: theme.palette.basecolorCode.main,
                  fontWeight: 600,
                  borderRadius: '24px',
                  px: 3,
                  py: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${theme.palette.basecolorCode.main}15`, // Light transparent background
                  }
                }}>
                Home
              </Button>
              
              {!isAuthenticated && (
                <>
                  <Button
                    id={"register_btn"}
                    sx={{ 
                      color: theme.palette.basecolorCode.main,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '24px',
                      px: 3,
                      py: 0.8,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: `${theme.palette.basecolorCode.main}15`,
                      }
                    }}
                    onClick={handleAuthDrawerToggle}
                  >
                    Register
                  </Button>

                  <Button
                    id={"login_btn"}
                    variant="contained"
                    sx={{ 
                      color: '#fff',
                      backgroundColor: theme.palette.basecolorCode.main,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '24px',
                      px: 3,
                      py: 0.8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.basecolorCode.secondary || theme.palette.basecolorCode.main,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                    onClick={handleAuthDrawerToggle}
                  >
                    Sign In
                    <PersonIcon sx={{ ml: 1, fontSize: '1.2rem' }} /> 
                  </Button>
                </>
              )}

              {isAuthenticated && (
                <Button
                  id={"profile_btn"}
                  component={Link}
                  to="/myaccount"
                  variant="contained"
                  sx={{ 
                    color: '#fff',
                    backgroundColor: theme.palette.basecolorCode.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '24px',
                    px: 3,
                    py: 0.8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.basecolorCode.secondary || theme.palette.basecolorCode.main,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <PersonIcon sx={{ fontSize: '1.2rem' }} />
                  {isAuthenticatedName !== '' ? isAuthenticatedName : 'Profile'}
                </Button>
              )}

              <IconButton color="inherit" onClick={handleAuthDrawerToggle} sx={{ position: 'relative' }}>
                <Badge badgeContent={cartItemsCount} sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.basecolorCode.main, 
                      color: theme.palette.footertextcolorCode.main,
                      boxShadow: '0 0 0 2px #ffffffb3',
                    },
                  }}>
                  <ShoppingBagIcon sx={{ fontSize: '24px' }} />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar >

        {/* Drawer for Mobile Navigation */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} sx={{ width: '280px' }}>
          {drawerContent}
        </Drawer>
        <AppRegister RegisterDrawerOpen={registerDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppLogin LoginDrawerOpen={loginDrawerOpen} setRegisterDrawerOpen={setRegisterDrawerOpen} setForgetPasswordDrawerOpen={setForgetPasswordDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppCart CartDrawerOpen={cartDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppForgetPassword ForgetPasswordDrawerOpen={forgetPasswordDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
      </AppBar>

    </>
  );
}
