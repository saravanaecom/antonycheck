/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import MyAccountSidebar from '../components/myAccount/MyAccountSidebar';
import Orders from '../components/myAccount/Orders';
import OrderDetails from '../components/myAccount/OrderDetails';
import Favorites from '../components/myAccount/Favorites';
import CustomerSupport from '../components/myAccount/CustomerSupport';
import Profile from '../components/myAccount/Profile';
import Wallet from '../components/myAccount/Wallet';
import Addresses from '../components/myAccount/Addresses';
import Referrals from '../components/myAccount/Referrals';
import PasswordSettings from '../components/myAccount/PasswordSettings';
import { API_FetchCustomerAddress } from '../services/userServices';
import { useAuth } from '../context/authContext';

const MyAccount = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeComponent, setActiveComponent] = useState('Orders');
    const [customerDetails, setCustomerDetails] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const FetchCustomerAddress = async (userId) => {
        try {
            const address = await API_FetchCustomerAddress(userId);
            setCustomerDetails(address);
        } catch (error) {
            console.error("Error fetching customer address:", error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const CId = userId ? decodeURIComponent(userId) : null;
        if (CId) FetchCustomerAddress(atob(CId));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const component = params.get('page');
        if (component) setActiveComponent(component);
    }, [location.search]);

    useEffect(() => {
        if (activeComponent === 'Logout') {
            setIsAuthenticated(false);
            localStorage.removeItem('userLogin');
            localStorage.removeItem('userId');
            navigate('/');
        } else {
            navigate(`/myaccount?page=${activeComponent}`, { replace: false });
        }
    }, [activeComponent, navigate, setIsAuthenticated]);

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Orders': return <Orders setActiveComponent={setActiveComponent} />;
            case 'OrderDetails': return <OrderDetails setActiveComponent={setActiveComponent} />;
            case 'Favorites': return <Favorites setActiveComponent={setActiveComponent} />;
            case 'CustomerSupport': return <CustomerSupport />;
            case 'Profile': return <Profile customerDetails={customerDetails} />;
            case 'Wallet': return <Wallet customerDetails={customerDetails} />;
            case 'Addresses': return <Addresses customerDetails={customerDetails} />;
            case 'ManageReferrals': return <Referrals />;
            case 'PasswordSettings': return <PasswordSettings customerDetails={customerDetails} />;
            default: return <Orders setActiveComponent={setActiveComponent} />;
        }
    };

    return (
        <Box sx={{ minHeight: '80vh', bgcolor: '#f5f6fa', py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}>
            <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Grid item xs={12} md={3}>
                    <MyAccountSidebar
                        CustomerDetails={customerDetails}
                        setActiveComponent={setActiveComponent}
                        activeComponent={activeComponent}
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box sx={{
                        bgcolor: '#fff',
                        borderRadius: 3,
                        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                        minHeight: 500,
                        overflow: 'hidden',
                    }}>
                        {renderActiveComponent()}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyAccount;
