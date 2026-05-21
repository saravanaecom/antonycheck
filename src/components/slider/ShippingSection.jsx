import React from 'react'
import {  Grid, Typography, } from '@mui/material';
import {  Box } from '@mui/material';
import CustomerSupport from '../../assets/shipping-CustomerSupport.png'
import FastDelivery from '../../assets/shipping-Fast_delivery.png'
import NeatPackaging from '../../assets/Neat-Packaging.png'
import NoSpillsGuaranteed from '../../assets/No-Spils-Guaranteed.png'

export default function ShippingSection() {
  return (
    <>
    <Box sx={{ backgroundColor: '#f6f6f6', textAlign: 'center', padding: '11px 0', borderRadius: '16px'}}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={3}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <img src={CustomerSupport} alt="Customer Support" style={{ height: '70px', width: '70px', marginRight: '8px' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Customer Support
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <img src={FastDelivery} alt="Fast Delivery" style={{ height: '70px', width: '70px', marginRight: '8px' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Fast Delivery
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <img src={NeatPackaging} alt="Neat Packaging" style={{ height: '70px', width: '70px', marginRight: '8px' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Neat Packaging
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <img src={NoSpillsGuaranteed} alt="No Spills Guaranteed" style={{ height: '70px', width: '70px', marginRight: '8px' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              No Spills Guaranteed
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>
  )
}
