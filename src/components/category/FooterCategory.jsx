import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { API_FetchCategory } from '../../services/categoryServices';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

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
    <Grid container spacing={3}>
      {categories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Link 
            to={`/product-list?pcid=${btoa(category.Id)}&pcname=${btoa(category.Category)}`} 
            style={{ textDecoration: 'none', color: theme.palette.footertextcolorCode?.main || 'inherit' }}
          >
            <Typography 
              fontSize={14} 
              component="p"
              sx={{ 
                '&:hover': { color: theme.palette.basecolorCode?.main || 'inherit' }
              }}
            >
              {category.Category}
            </Typography>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
