import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function CategoryHeader({ CategoryHeading, categoryId, categoryValue }) {
  const theme = useTheme();
  const navigate = useNavigate();

  function handleViewBtnClick (event) {
    navigate(`/product-list?pcid=${btoa(event.currentTarget.id)}&pcname=${btoa(event.currentTarget.value)}`);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 2 },
        borderRadius: '50px', // Circular/pill-shaped appearance
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)', // Soft shadows
        border: '1px solid rgba(0,0,0,0.02)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Hover animation
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Typography 
        component={'h2'}
        sx={{ 
          fontSize: { xs: '16px', sm: '18px', md: '22px' }, 
          fontWeight: 800,
          color: theme.palette.colorCode.main,
          textTransform: 'capitalize',
          letterSpacing: 0.5,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          '&::before': {
            content: '""',
            display: 'block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: theme.palette.basecolorCode.main,
          }
        }}
      >
        {CategoryHeading}
      </Typography>
      
      <Button
        id={categoryId}
        value={categoryValue}
        onClick={handleViewBtnClick}
        endIcon={<ArrowForward sx={{ fontSize: '18px !important' }} />}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: { xs: '13px', sm: '14px' }, 
          padding: { xs: '6px 16px', sm: '8px 20px' }, 
          borderRadius: '30px',
          backgroundColor: `${theme.palette.basecolorCode.main}10`, // Light red background
          color: theme.palette.basecolorCode.main,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.basecolorCode.main,
            color: '#ffffff',
            transform: 'translateX(4px)'
          }
        }}
      >
        View All
      </Button>
    </Box>
  );
}

export default CategoryHeader;