import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { API_FetchOfferFastMovingProduct } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export default function PremiumTrendingOffers(props) {
  const [productLists, setProductLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await API_FetchOfferFastMovingProduct();
        setProductLists(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (!loading && (!productLists || productLists.length === 0)) {
    return null;
  }

  // Take only top 4 for a premium grid layout
  const topOffers = productLists.slice(0, 4);

  return (
    <Box sx={{ my: { xs: 4, md: 5 }, px: { xs: 2, md: 5 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Chip 
            icon={<LocalFireDepartmentIcon />} 
            label="HOT DEALS" 
            sx={{ backgroundColor: '#ff9800', color: '#fff', fontWeight: 'bold', mb: 1 }} 
          />
          <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.colorCode.main, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Trending <span style={{ color: theme.palette.basecolorCode.main }}>Offers</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, maxWidth: 500 }}>
            Grab these limited-time deals on our freshest cuts. Highest quality guaranteed at unbeatable prices.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))
        ) : (
          topOffers.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Box sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  background: '#fff',
                  border: `1px solid ${theme.palette.shadowcolorCode.main}`
                }}>
                  <ProductCard product={product} />
                </Box>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
