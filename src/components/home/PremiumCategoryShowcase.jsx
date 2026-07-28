import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { API_FetchCategory } from '../../services/categoryServices';
import { API_FetchProductByCategory } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';
import CategoryIcon from '@mui/icons-material/Category';
import { Link } from 'react-router-dom';

export default function PremiumCategoryShowcase() {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryList = await API_FetchCategory();
        // Take top 2 categories for the showcase
        const topCategories = categoryList.slice(0, 2);
        
        const categoriesData = await Promise.all(
          topCategories.map(async (cat) => {
            try {
              const products = await API_FetchProductByCategory(cat.Id, 1, 0, 1);
              return {
                ...cat,
                products: products && products.length > 0 ? products.slice(0, 4) : []
              };
            } catch (err) {
              console.error(`Failed to fetch products for category ${cat.Category}:`, err);
              return { ...cat, products: [] };
            }
          })
        );
        
        setCategoriesWithProducts(categoriesData.filter(c => c.products.length > 0));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  if (!loading && categoriesWithProducts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: { xs: 4, md: 6 } }}>
      {loading ? (
        <Box sx={{ px: { xs: 2, md: 5 } }}>
           <Skeleton variant="rectangular" height={50} sx={{ mb: 4, borderRadius: '8px' }} />
           <Grid container spacing={3}>
             {Array.from(new Array(4)).map((_, i) => (
               <Grid item xs={12} sm={6} md={3} key={i}>
                 <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
               </Grid>
             ))}
           </Grid>
        </Box>
      ) : (
        categoriesWithProducts.map((catData, index) => (
          <Box 
            key={catData.Id} 
            sx={{ 
              mb: { xs: 6, md: 10 },
              px: { xs: 2, md: 5 },
              py: { xs: 4, md: 6 },
              backgroundColor: index % 2 === 0 ? `${theme.palette.basecolorCode.main}10` || '#f9f9f9' : 'transparent',
              borderRadius: index % 2 === 0 ? '24px' : '0'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: theme.palette.basecolorCode.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon fontSize="small" /> Premium Selection
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.colorCode.main, fontSize: { xs: '1.8rem', md: '2.4rem' }, mt: 1, textTransform: 'capitalize' }}>
                  Best in <span style={{ color: theme.palette.basecolorCode.main }}>{catData.Category}</span>
                </Typography>
              </Box>
              <Button 
                component={Link}
                to={`/product-list?pcid=${btoa(catData.Id)}&pcname=${btoa(catData.Category)}`}
                sx={{ display: { xs: 'none', md: 'block' }, color: theme.palette.basecolorCode.main, fontWeight: 'bold' }}
              >
                View All {catData.Category} →
              </Button>
            </Box>

            <Grid container spacing={4}>
              {catData.products.map((product, pIndex) => (
                <Grid item xs={12} sm={6} md={3} key={product.id || pIndex}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: pIndex * 0.1 }}
                  >
                    <Box sx={{ 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                      background: '#fff',
                      border: `1px solid ${theme.palette.basecolorCode.main}20`
                    }}>
                      <ProductCard product={product} />
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            <Button 
                component={Link}
                to={`/product-list?pcid=${btoa(catData.Id)}&pcname=${btoa(catData.Category)}`}
                sx={{ display: { xs: 'block', md: 'none' }, width: '100%', mt: 3, color: theme.palette.basecolorCode.main, fontWeight: 'bold' }}
              >
                View All {catData.Category} →
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
}
