/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Divider, Paper } from '@mui/material';
import { Edit, Delete, AddLocationAlt, LocationOn } from '@mui/icons-material';
import AddAddressModal from '../modalPopup/addAddressModal';
import ConfirmationPopup from '../modalPopup/confirmationPopup';
import { API_FetchCustomerAddress, API_DeleteCustomerAddress } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';
import CircularLoader from '../circular-loader';

const Address = () => {
    const theme = useTheme();
    const primary = theme.palette.basecolorCode?.main || '#e65c00';
    const [customerDetails, setcustomerDetails] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [UserId, setUserId] = useState(0);
    let [objlist, setObjlist] = useState({});
    const [modalState, setModalState] = useState({
        addressModalOpen: false,
        addressModalType: '',
        confirmationModalOpen: false,
        currentAddress: '',
    });

    const handleModalOpen = (type, address, Id, ParentId) => {
        if (type === 'New' || type === 'Update') {
            setModalState({ ...modalState, addressModalOpen: true, addressModalType: type, currentAddress: address });
        } else if (type === 'Delete') {
            setModalState({ ...modalState, type, confirmationModalOpen: true, currentAddress: address, Id, ParentId });
        }
    };

    const handleModalClose = () => setModalState({ ...modalState, addressModalOpen: false, confirmationModalOpen: false, currentAddress: null });

    const handleConfirmationAction = async (event) => {
        if (event.target.value === 'Yes' && modalState.type === 'Delete' && modalState.Id !== 0) {
            await API_DeleteCustomerAddress(modalState.Id);
            await FetchCustomerAddress(modalState.ParentId);
        }
        handleModalClose();
    };

    const FetchCustomerAddress = async (userId) => {
        setShowLoader(true);
        try {
            const address = await API_FetchCustomerAddress(userId);
            setcustomerDetails(address);
            objlist = { ParentId: address[0].Id, CustomerName: address[0].CustomerName, Email: address[0].Email, MobileNo: address[0].MobileNo };
            setShowLoader(false);
        } catch (error) {
            console.error("Error fetching customer address:", error);
            setShowLoader(false);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const CId = userId ? decodeURIComponent(userId) : null;
        if (CId) { setUserId(atob(CId)); FetchCustomerAddress(atob(CId)); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <CircularLoader showLoader={showLoader} />
            <AddAddressModal
                AddressModalOpen={modalState.addressModalOpen}
                AddressModalType={modalState.addressModalType}
                handleAddressModalClose={handleModalClose}
                AddressDetails={modalState.currentAddress}
                UserId={UserId}
                setUserId={setUserId}
                fetchCustomerAddress={FetchCustomerAddress}
            />
            <ConfirmationPopup
                ConfirmationModalOpen={modalState.confirmationModalOpen}
                handleConfirmationModalClose={handleModalClose}
                handleConfirmationClick={handleConfirmationAction}
            />

            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a2e' }}>Saved Addresses</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddLocationAlt />}
                        onClick={() => handleModalOpen('New', objlist, 0)}
                        sx={{
                            bgcolor: primary, color: '#fff', textTransform: 'none', borderRadius: 2,
                            boxShadow: 'none', '&:hover': { bgcolor: primary, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                        }}
                    >
                        Add New
                    </Button>
                </Box>

                {customerDetails.length === 0 ? (
                    <Box textAlign="center" py={6}>
                        <LocationOn sx={{ fontSize: 56, color: '#e0e0e0', mb: 1 }} />
                        <Typography color="text.secondary">No saved addresses yet.</Typography>
                    </Box>
                ) : (
                    customerDetails.map((address, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{ mb: 2, p: 2, border: '1px solid #f0f0f0', borderRadius: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}
                        >
                            <Box sx={{ mt: 0.5, color: primary }}>
                                <LocationOn />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={600} sx={{ color: '#1a1a2e', mb: 0.3 }}>
                                    {address.AddressType || 'Home'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`${address.Address1}, ${address.Address2} ${address.City} - ${address.Pincode}`}
                                </Typography>
                                {address.Landmark && (
                                    <Typography variant="body2" color="text.secondary">{address.Landmark}</Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton size="small" onClick={() => handleModalOpen('Update', address, address.Id, address.ParentId)}
                                    sx={{ color: '#555', '&:hover': { color: primary } }}>
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    disabled={address.ParentId === 0 || address.Id === address.ParentId}
                                    onClick={() => handleModalOpen('Delete', address, address.Id, address.ParentId)}
                                    sx={{ color: '#555', '&:hover': { color: '#e53935' } }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>
        </>
    );
};

export default Address;
