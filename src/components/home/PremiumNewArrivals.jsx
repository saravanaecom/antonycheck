import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { API_FetchNewProduct } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';
import FiberNewIcon from '@mui/icons-material/FiberNew';

export default function PremiumNewArrivals() {
  const [productLists, setProductLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await API_FetchNewProduct();
        setProductLists(data);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (!loading && (!productLists || productLists.length === 0)) {
    return null;
  }

  // Take only top 4 for a premium grid layout
  const newArrivals = productLists.slice(0, 4);

  return (
    <Box sx={{ my: { xs: 4, md: 5 }, px: { xs: 2, md: 5 }, py: { xs: 4, md: 5 }, backgroundColor: theme.palette.shadowcolorCode.main, borderRadius: '24px' }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4} textAlign="center">
        <FiberNewIcon sx={{ fontSize: 40, color: theme.palette.basecolorCode.main, mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.colorCode.main, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
          New <span style={{ color: theme.palette.basecolorCode.main }}>Arrivals</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, maxWidth: 600 }}>
          Be the first to try our latest premium additions. Carefully selected and curated just for you.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))
        ) : (
          newArrivals.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.id || index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Box sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  background: '#fff',
                }}>
                  <ProductCard product={product} newProducts='new_product' />
                </Box>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
