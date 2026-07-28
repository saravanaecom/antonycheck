import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { API_FetchProductByIndexPage } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Link } from 'react-router-dom';

export default function PremiumOurProducts() {
  const [productLists, setProductLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await API_FetchProductByIndexPage();
        if (data && data.data1) {
          setProductLists(data.data1);
        }
      } catch (error) {
        console.error('Failed to fetch our products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!loading && (!productLists || productLists.length === 0)) {
    return null;
  }

  // Take a larger chunk of products for the main catalog view
  const displayProducts = productLists.slice(0, 12);

  return (
    <Box sx={{ my: { xs: 6, md: 8 }, px: { xs: 2, md: 5 } }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={6} textAlign="center">
        <Box sx={{ 
          p: 2, 
          borderRadius: '50%', 
          backgroundColor: `${theme.palette.basecolorCode.main}15`,
          mb: 2
        }}>
          <LocalMallIcon sx={{ fontSize: 40, color: theme.palette.basecolorCode.main }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.colorCode.main, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
          Explore <span style={{ color: theme.palette.basecolorCode.main }}>Our Products</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2, maxWidth: 700 }}>
          Browse our complete selection of premium, farm-fresh meats and seafood. Hand-cut and delivered straight to your door.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))
        ) : (
          displayProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.id || index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
              >
                <Box sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  background: '#fff',
                  border: `1px solid ${theme.palette.shadowcolorCode?.main || '#f0f0f0'}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  }
                }}>
                  <ProductCard product={product} />
                </Box>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
      
      {!loading && productLists.length > 0 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Button 
            component={Link}
            to="/categories?cid=YWxsX2NhdGVnb3JpZXM=&cname=QWxsIENhdGVnb3JpZXM=" 
            variant="contained" 
            size="large"
            sx={{ 
              backgroundColor: theme.palette.basecolorCode.main, 
              color: '#fff', 
              px: 5, py: 1.5, 
              fontSize: '1.1rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: `0 8px 20px ${theme.palette.shadowcolorCode?.main || 'rgba(0,0,0,0.2)'}`,
              '&:hover': {
                backgroundColor: theme.palette.basecolorCode.secondary || theme.palette.basecolorCode.main,
              }
            }}
          >
            View All Categories
          </Button>
        </Box>
      )}
    </Box>
  );
}
