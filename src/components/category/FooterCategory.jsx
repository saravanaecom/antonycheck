import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import { API_FetchCategory } from '../../services/categoryServices';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function FooterCategories() {
  const [categories, setCategories] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API_FetchCategory();
        if (response && response.length > 0) {
          setCategories(response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
        <StorefrontIcon sx={{ color: theme.palette.basecolorCode.main, mr: 1.5, fontSize: 32 }} />
        <Typography variant="h5" fontWeight={800} sx={{ color: theme.palette.colorCode.main, textTransform: 'uppercase', letterSpacing: 1 }}>
          Explore Our Categories
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {categories.map((category, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Link 
              to={`/product-list?pcid=${btoa(category.Id)}&pcname=${btoa(category.Category)}`} 
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <Paper
                elevation={0}
                sx={{
                  py: 1.5,
                  px: 2,
                  textAlign: 'center',
                  borderRadius: '30px',
                  border: `1px solid rgba(0,0,0,0.08)`,
                  backgroundColor: '#fff',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    backgroundColor: theme.palette.basecolorCode.main,
                    borderColor: theme.palette.basecolorCode.main,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(214, 40, 40, 0.2)',
                    '& .category-text': {
                      color: '#ffffff',
                      fontWeight: 600
                    }
                  }
                }}
              >
                <Typography 
                  className="category-text"
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.colorCode.main,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {category.Category}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
