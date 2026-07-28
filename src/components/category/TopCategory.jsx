/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { Container } from '@mui/material';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { API_FetchCategory } from '../../services/categoryServices';
import { useTheme } from '@mui/material/styles';

const TopCategory = (props) => {
  const [categoryValue, setCategoryValue] = useState(false);
  const [categoryLists, setCategoryLists] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);   
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isActiveCategory, setIsActiveCategory] = React.useState(false); 
  const [isScrolled, setIsScrolled] = useState(false);
  
  const backgroundColorCaterogy = '#ffffff';

  const handleCategoryClickChange = (event, newValue) => {
    const selectedCategoryId = event.currentTarget.id; 
    setCategoryValue(newValue); 
    navigate(`/product-list?pcid=${btoa(selectedCategoryId)}&pcname=${btoa(newValue)}`);
  };

  const FetchTopCategoryLists = async () => {
    try {
      const categoryList = await API_FetchCategory();
      setCategoryLists(categoryList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {   
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    FetchTopCategoryLists();
    if(location.pathname.startsWith('/product-list')){
      setIsActiveCategory(true);
    } else {
      setIsActiveCategory(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (props.get_catgory_lists && props.get_catgory_lists.length > 0) {
      setIsLoading(false);
    }

    const params = new URLSearchParams(location.search);
    const pcid = params.get('pcid');
    const pcname = params.get('pcname');
    if (pcid && pcname) {
      const decodedPcid = atob(pcid);
      const decodedPcname = atob(pcname);
      setCategoryValue(decodedPcname);      
    } else {
      setCategoryValue(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.get_catgory_lists, location.search]);

  return (
    <Box 
      position={isScrolled ? 'sticky' : 'relative'}   
      elevation={isScrolled ? 4 : 0} 
      sx={{ 
        width: '100%',  
        backgroundColor: backgroundColorCaterogy,
        borderBottom: isScrolled ? `1px solid ${theme.palette.shadowcolorCode?.main || '#f0f0f0'}` : 'none',
        boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
        zIndex: 99,
        top: 0,
        transition: 'all 0.3s ease',
        py: { xs: 1, md: 2 } // Compact padding instead of the massive pb: 20
      }}
    > 
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Tabs 
          value={categoryValue}
          onChange={handleCategoryClickChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable category tabs"
          sx={{
            alignItems: 'center',
            minHeight: 'auto',
            // horizontal padding so scroll buttons don't cover content
            px: { xs: 2, md: 4 },
            // ensure scroller does not clip expanded/hovered avatars
            '.MuiTabs-scroller': { overflow: 'visible' },
            '.MuiTab-root': { overflow: 'visible' },
            position: 'relative',
            '.MuiTabs-indicator': {
              display: 'none', // Hide standard indicator
            },
            '.MuiTabs-scrollButtons': {
              color: theme.palette.basecolorCode.main,
              width: '40px',
              height: '40px',
              borderRadius: '50%', // Make the hover background perfectly circular
              // position buttons outside the tab area so they don't overlap avatars
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 12,
              '&.MuiTabs-scrollButtons:first-of-type': {
                left: -18
              },
              '&.MuiTabs-scrollButtons:last-of-type': {
                right: -18
              },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)', // Subtle gray background on hover instead of solid color
              },
              '&.Mui-disabled': { opacity: 0.3 }
            }
          }}
        >
          {/* Dynamically loaded category list */}
          {isLoading ? (
            [...Array(8)].map((_, index) => (
              <Tab
                key={index}
                disabled
                sx={{ minWidth: 'auto', p: 1, mx: 1 }}
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={65} height={65} />
                    <Skeleton variant="text" width={60} height={16} sx={{ mt: 1 }} />
                  </Box>
                }
              />
            ))
          ) : (
            categoryLists.map((item, index) => {
              const isSelected = isActiveCategory && categoryValue === item.Category;
              
              return (
                <Tab
                  key={index}
                  id={item.Id}
                  value={item.Category}
                  sx={{
                    minWidth: 'auto',
                    p: { xs: 0.5, md: 1 },
                    mx: { xs: 1, md: 2 }, // Slightly increased spacing between bubbles
                    position: 'relative',
                    zIndex: 0,
                    borderRadius: '12px',
                    transition: 'transform 0.18s, z-index 0.18s',
                    // use scale instead of translate to avoid lateral overlap
                    '&:hover': {
                      transform: 'scale(1.06)',
                      zIndex: 5 // ensure hovered bubble stacks above neighbours
                    }
                  }}
                  label={
                      <Box 
                      id={item.Id} 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 1,
                        // ensure the avatar container does not create unexpected overlap
                        overflow: 'visible'
                      }}
                    >
                      {/* Premium Ring around Avatar when selected */}
                      <Box 
                        sx={{
                          padding: '3px',
                          borderRadius: '50%',
                          background: isSelected ? `linear-gradient(45deg, ${theme.palette.basecolorCode.main}, #ff9800)` : 'transparent',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Avatar
                          src={ImagePathRoutes.CategoryImagePath + item.ImagePath}
                          sx={{ 
                              width: { xs: 60, md: 75 }, 
                              height: { xs: 60, md: 75 }, 
                              boxShadow: isSelected ? 'none' : '0 4px 10px rgba(0,0,0,0.1)',
                              border: '3px solid #fff',
                              backgroundColor: '#f9f9f9',
                              position: 'relative',
                              zIndex: isSelected ? 8 : 2,
                              transition: 'transform 0.18s, box-shadow 0.18s'
                            }}
                          alt={item.Category}
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          textAlign: 'center', 
                          textTransform: 'capitalize', 
                          fontWeight: isSelected ? 800 : 600, 
                          fontSize: { xs: '12px', md: '14px' }, 
                          color: isSelected ? theme.palette.basecolorCode.main : 'text.secondary',
                          transition: 'color 0.3s'
                        }}
                      >
                        {item.Category}
                      </Typography>
                    </Box>
                  }
                />
              );
            })
          )}
        </Tabs>
      </Container>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    get_catgory_lists: state.get_catgory_lists,
  };
};

export default connect(mapStateToProps, null)(TopCategory);
