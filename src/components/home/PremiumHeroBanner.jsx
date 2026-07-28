import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_FetchBannerOfferPost } from '../../services/bannerOfferPostServices';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function PremiumHeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await API_FetchBannerOfferPost();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height={600} />;
  }

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: 400, md: 600 }, overflow: 'hidden', borderRadius: { xs: 0, md: '24px' }, mb: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${ImagePathRoutes.BannerOfferPostImagePath + currentBanner.Imagepath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Glassmorphism Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 4, md: 10 }
        }}
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, mb: 2, maxWidth: 600, fontSize: { xs: '2.5rem', md: '4rem' }, textTransform: 'uppercase', letterSpacing: '2px', textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>
            Fresh Farm <br /> <span style={{ color: theme.palette.basecolorCode.main }}>Chicken</span>
          </Typography>
          <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 4, maxWidth: 500, fontWeight: 300 }}>
            Experience the finest quality, farm-fresh meat delivered straight to your door with guaranteed hygiene.
          </Typography>
          
          <Button 
            component={Link}
            to="/product-list?pcid=MTAwMDAyMjk=&pcname=Q0hJQ0tFTg=="
            variant="contained" 
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              backgroundColor: theme.palette.basecolorCode.main, 
              color: '#fff', 
              px: 4, py: 1.5, 
              fontSize: '1.1rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: `0 8px 20px ${theme.palette.shadowcolorCode?.main || 'rgba(0,0,0,0.2)'}`,
              '&:hover': {
                backgroundColor: theme.palette.basecolorCode.secondary || theme.palette.basecolorCode.main,
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 25px ${theme.palette.shadowcolorCode?.main || 'rgba(0,0,0,0.3)'}`
              },
              transition: 'all 0.3s ease'
            }}
          >
            Order Now
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
