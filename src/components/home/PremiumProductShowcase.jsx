import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Skeleton, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_FetchProductByIndexPage } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';
import StarIcon from '@mui/icons-material/Star';

export default function PremiumProductShowcase() {
  const [productLists, setProductLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const data = await API_FetchProductByIndexPage();
        // The API returns data.data1
        if(data && data.data1) {
            setProductLists(data.data1);
        } else if (Array.isArray(data)) {
            setProductLists(data);
        }
      } catch (error) {
        console.error('Failed to fetch showcase products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcase();
  }, []);

  if (!loading && (!productLists || productLists.length === 0)) {
    return null;
  }

  // Display top 8 products in the showcase grid
  const showcaseProducts = productLists.slice(0, 8);

  return (
    <Box sx={{ my: { xs: 4, md: 5 }, px: { xs: 2, md: 5 } }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4} textAlign="center">
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: theme.palette.basecolorCode.main, display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon fontSize="small" /> Premium Selection <StarIcon fontSize="small" />
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.colorCode.main, fontSize: { xs: '1.8rem', md: '2.4rem' }, mt: 1 }}>
          Our <span style={{ color: theme.palette.basecolorCode.main }}>Signature</span> Cuts
        </Typography>
        <Box sx={{ width: 80, height: 4, backgroundColor: theme.palette.basecolorCode.main, my: 2, borderRadius: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
          Explore our most loved signature products, handpicked by our butchers for unparalleled quality and taste.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))
        ) : (
          showcaseProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Box sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                  background: '#fff',
                  border: `1px solid ${theme.palette.shadowcolorCode.main}`,
                  height: '100%'
                }}>
                  <ProductCard product={product} />
                </Box>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
      
      <Box display="flex" justifyContent="center" mt={6}>
        <Button 
          component={Link}
          to="/product-list?pcid=MTAwMDAyMjk=&pcname=Q0hJQ0tFTg=="
          variant="outlined" 
          size="large"
          sx={{ 
            borderColor: theme.palette.basecolorCode.main, 
            color: theme.palette.basecolorCode.main,
            px: 6, py: 1.5,
            borderRadius: '30px',
            fontWeight: 'bold',
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              backgroundColor: theme.palette.basecolorCode.main,
              color: '#fff'
            }
          }}
        >
          View All Products
        </Button>
      </Box>
    </Box>
  );
}
