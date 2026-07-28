/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Chip, Avatar } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { ServerURL } from '../../server/serverUrl';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { API_FetchMyOrders } from '../../services/userServices';
import ConfirmationPopup from '../modalPopup/confirmationPopup';
import NoImage from '../../assets/no-image.png';
import { useTheme } from '@mui/material/styles';

const statusConfig = {
    Pending:   { color: '#f59e0b', bg: '#fffbeb', label: 'Pending' },
    Accepted:  { color: '#3b82f6', bg: '#eff6ff', label: 'Accepted' },
    Delivered: { color: '#10b981', bg: '#ecfdf5', label: 'Delivered' },
    Cancel:    { color: '#6b7280', bg: '#f3f4f6', label: 'Cancelled' },
};

const Orders = ({ setActiveComponent }) => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';
    const [visibleOrders, setVisibleOrders] = useState(5);
    const [orderLists, setOrderLists] = useState([]);
    const [modalState, setModalState] = useState({ confirmationModalOpen: false, orderId: 0 });

    const FetchMyOrders = async (userId) => {
        try {
            const orderList = await API_FetchMyOrders(userId);
            setOrderLists(orderList);
        } catch (error) {
            console.error("Error fetching order lists:", error);
        }
    };

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        userId = Number(atob(userId));
        FetchMyOrders(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleViewOrderDetails = (order) => {
        if (order.length !== 0) {
            setActiveComponent('OrderDetails');
            sessionStorage.setItem("OrderDetails", JSON.stringify(order));
        }
    };

    const handleModalClose = () => setModalState({ confirmationModalOpen: false, orderId: 0 });

    return (
        <>
            <ConfirmationPopup
                ConfirmationModalOpen={modalState.confirmationModalOpen}
                handleConfirmationModalClose={handleModalClose}
                handleConfirmationClick={handleModalClose}
            />
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5} sx={{ color: '#1a1a2e' }}>
                    My Orders
                </Typography>

                {orderLists && Array.isArray(orderLists) && orderLists.length > 0 ? (
                    orderLists.slice(0, visibleOrders).map((order, index) => {
                        const status = statusConfig[order.orderstatus] || statusConfig.Pending;
                        return (
                            <Paper
                                key={index}
                                onClick={() => handleViewOrderDetails(order)}
                                elevation={0}
                                sx={{
                                    mb: 2,
                                    border: '1px solid #f0f0f0',
                                    borderRadius: 2.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderColor: primary },
                                }}
                            >
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 64, height: 64, borderRadius: 2,
                                        overflow: 'hidden', flexShrink: 0,
                                        border: '1px solid #f0f0f0', bgcolor: '#fafafa',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <img
                                            src={order.Img0 ? ImagePathRoutes.ProductImagePath + order.Img0 : NoImage}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Chip
                                                label={status.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: status.bg,
                                                    color: status.color,
                                                    fontWeight: 600,
                                                    fontSize: 11,
                                                    height: 22,
                                                    border: `1px solid ${status.color}30`,
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                                            Placed on {order.OrderDate.split('T')[0]}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                        <Typography fontWeight={700} sx={{ color: '#1a1a2e', fontSize: 15 }}>
                                            {order.Grossamt.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2 })}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: primary, mt: 0.5 }}>
                                            <Typography variant="caption" fontWeight={600} sx={{ color: primary }}>View</Typography>
                                            <KeyboardArrowRightIcon sx={{ fontSize: 16, color: primary }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                        <Typography color="text.secondary">No orders found.</Typography>
                    </Box>
                )}

                {visibleOrders < orderLists.length && (
                    <Box textAlign="center" mt={2}>
                        <Button
                            variant="outlined"
                            onClick={() => setVisibleOrders(v => v + 5)}
                            sx={{ borderColor: primary, color: primary, '&:hover': { borderColor: primary, bgcolor: `${primary}0d` } }}
                        >
                            Load More
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Orders;
