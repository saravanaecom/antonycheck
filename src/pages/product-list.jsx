/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Select,
  MenuItem,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  Avatar,
  CircularProgress,
  Backdrop
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import { API_FetchOfferFastMovingProduct, API_FetchNewProduct, API_FetchProductIdMoreItems, API_FetchProductByCategory, API_FetchProductBySubCategory } from '../services/productListServices';
import { API_FetchCategorySubCategory } from '../services/categoryServices';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const drawerWidth = 240;

const ListItemStyled = styled(ListItem)(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '7px',
  backgroundColor: selected ? '#F3E6FB' : '#fff',
  color: selected ? '#A700D1' : '#000',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const IconLabel = styled(Typography)({
  fontSize: '14px',
  marginTop: '5px',
  textAlign: 'center',
});

const ProductList = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [subcategories, setSubcategories] = useState([]);
  const [productLists, setProductLists] = useState([]);
  const [filteredProductLists, setFilteredProductLists] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);  
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [offerProducts, setOfferProducts] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState(null);
  const [Multipleitems, setMultipleitems] = useState(1);
  const [Startindex, setStartindex] = useState(0);
  const [PageCount, setPageCount] = useState(1);
  const [productFilterName, setProductFilterName] = useState('All products');

  const handleSubCategoryClick = (subCategoryName, SubCategoryId) => {
    setSubCategoryId(SubCategoryId);
    navigate(`/product-list?pcid=${btoa(atob(categoryId))}&pcname=${btoa(atob(categoryName))}&pscid=${btoa(SubCategoryId)}&pscname=${subCategoryName}`);
    setActiveCategory(subCategoryName);
    setProductLists([]);
    if (subCategoryName === "All Products") {
      GetProductLists(atob(categoryId), Multipleitems, Startindex, PageCount);
    } else {
      GetProductListsBySubCategory(SubCategoryId, Multipleitems, Startindex, PageCount);
    }
  };

  const GetCategoryBySubCategory = async (categoryId) => {
    try {
      if (categoryId !== "offer_product" && categoryId !== "related_product") {
        setLoading(true);
        setBackdropOpen(true);

        const subcategories = await API_FetchCategorySubCategory(categoryId);
        setLoading(false);
        setBackdropOpen(false);

        const allProductsCategory = { SubCategory: 'All Products' };
        setSubcategories([allProductsCategory, ...subcategories]);
        return subcategories;
      }
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      setLoading(false);
      setBackdropOpen(false);
      return [];
    }
  };

  const GetProductLists = async (categoryId, Multipleitems, Startindex, PageCount) => {
    try {
      setLoading(true);
      setBackdropOpen(true);
      setProductLists([]);
      let productLists = [];
      if (categoryId === "offer_product") {
        setRelatedProducts(null);
        setNewProducts(null);
        setOfferProducts(categoryId);
        setActiveCategory("Offer products for you");
        productLists = await API_FetchOfferFastMovingProduct();
      }
      else if (categoryId === "new_product") {
        setOfferProducts(null);
        setRelatedProducts(null);
        setNewProducts(categoryId);
        setActiveCategory("New products for you");
        productLists = await API_FetchNewProduct();
      }
      else if (categoryId === "related_product") {
        setOfferProducts(null);
        setNewProducts(null);
        setRelatedProducts(atob(categoryName));
        setActiveCategory("You might also like products");
        productLists = await API_FetchProductIdMoreItems(atob(categoryName));
      }      
      else {
        setOfferProducts(null);
        setRelatedProducts(null);
        setNewProducts(null);
        productLists = await API_FetchProductByCategory(categoryId, Multipleitems, Startindex, PageCount);
      }
      setProductLists(productLists);
      setLoading(false);
      setBackdropOpen(false);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setLoading(false);
      setBackdropOpen(false);
      setProductLists([]);
    }
  };

  const GetProductListsBySubCategory = async (SubCategoryId, Multipleitems, Startindex, PageCount) => {
    try {
      if (SubCategoryId !== null) {
        setLoading(true);
        setBackdropOpen(true);
        setProductLists([]);
        const productLists = await API_FetchProductBySubCategory(SubCategoryId, Multipleitems, Startindex, PageCount);
        setProductLists(productLists);
        setLoading(false);
        setBackdropOpen(false);
      }
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      setLoading(false);
      setBackdropOpen(false);
      setProductLists([]);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedId = queryParams.get('pcid');
    const encodedName = queryParams.get('pcname');
    const encodedSId = queryParams.get('pscid');
    const encodedSName = queryParams.get('pscname');
    setCategoryId(decodeURIComponent(encodedId));
    setCategoryName(decodeURIComponent(encodedName));
    setSubCategoryId(decodeURIComponent(encodedSId));
    setSubCategoryName(decodeURIComponent(encodedSName));
    if(atob(encodedId) !== 'new_product'){
      GetCategoryBySubCategory(atob(encodedId));
    }    
    if (encodedSId === null) {
      setActiveCategory("All Products");
      GetProductLists(atob(encodedId), Multipleitems, Startindex, PageCount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, categoryId, categoryName, Multipleitems, Startindex, PageCount]);

  // Function to filter products based on the selected option
  const handleProductFilterChange = (event) => {
    const filterName = event.target.value;
    setProductFilterName(filterName);
  };

  // Apply filtering logic whenever the product list or filter name changes
  useEffect(() => {
    let sortedProducts = [...productLists];

    switch (productFilterName) {
      case "Price(Low > High)":
        sortedProducts.sort((a, b) => (a.Price || 0) - (b.Price || 0));
        break;
      case "Price(High > Low)":
        sortedProducts.sort((a, b) => (b.Price || 0) - (a.Price || 0));
        break;
      case "Alphabetical":
        sortedProducts.sort((a, b) => (a.Description || "").localeCompare(b.Description || ""));
        break;
      case "Alphabetical Reverse":
        sortedProducts.sort((a, b) => (b.Description || "").localeCompare(a.Description || ""));
        break;
      default:
        sortedProducts = [...productLists];
    }

    setFilteredProductLists(sortedProducts);
  }, [productFilterName, productLists]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight &&
        !loading
      ) {
        //setPageCount(prevIndex => prevIndex + 5);
        // You can call GetProductLists or GetProductListsBySubCategory here if needed
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [productLists, loading, PageCount]);


  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="xl" sx={{ px: { xs: 0, md: 3 } }}>
        <Grid >
          {/* Left-side Drawer */}
          {/* {offerProducts === null && relatedProducts === null && newProducts === null ?
            <Grid item xs={2.5} md={2} sx={{ display: { xs: 'none', md: 'block' } }} style={{ position: 'sticky', top: 0, height: '100vh' }}>
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  position: "relative",
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    position: "relative",
                  },
                }}
              >
                <List>
                  {subcategories.map((category, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleSubCategoryClick(category.SubCategory, category.Id)}
                      sx={{
                        borderLeft: activeCategory === category.SubCategory ? `4px solid ${theme.palette.basecolorCode.main}` : 'none',
                        backgroundColor: activeCategory === category.SubCategory ? `${theme.palette.basecolorCode.main}15` : 'transparent',
                        color: activeCategory === category.SubCategory ? `${theme.palette.basecolorCode.main}` : theme.palette.lightblackcolorCode.main,
                        '& .MuiListItemIcon-root': {
                          color: activeCategory === category.SubCategory ? theme.palette.basecolorCode.main : 'inherit',
                        },
                        '&:hover': {
                          backgroundColor: `${theme.palette.basecolorCode.main}15`,
                          color: theme.palette.basecolorCode.main
                        },
                      }}
                    >
                      <img
                        style={{
                          position: 'relative',
                          height: '3rem',
                          width: '3rem',
                          borderRadius: '9999px',
                          padding: '.25rem',
                          backgroundColor: theme.palette.shadowcolorCode.main,
                          marginRight: 10,
                        }}
                        src={category.ImagePath ? ImagePathRoutes.SubCategoryImagePath + category.ImagePath : "https://www.healthysteps.in/categoryimages/All-categories.png"}
                      />
                      <ListItemText
                        primary={category.SubCategory}
                        primaryTypographyProps={{
                          style: {
                            fontWeight: activeCategory === category.SubCategory ? 'bold' : 'normal',
                            fontFamily: 'inherit'
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Grid>
            :
            <></>
          } */}


          {/* Mobile Drawer Toggle Button */}
          {/* {offerProducts === null && relatedProducts === null && newProducts === null ?
            <Grid item xs={2.5} sx={{ display: { xs: 'block', md: 'none' } }} style={{ position: 'sticky', top: 0, height: '100vh' }}>
              <Drawer
                variant="permanent"
                sx={{
                  width: '80px',
                  flexShrink: 0,
                  position: "relative",
                  '& .MuiDrawer-paper': {
                    width: '80px',
                    boxSizing: 'border-box',
                    position: "relative",
                  },
                }}
              >
                <List>
                  {subcategories.map((category, index) => (
                    <ListItemStyled
                      key={index}
                      onClick={() => handleSubCategoryClick(category.SubCategory, category.Id)}
                      sx={{
                        borderLeft: activeCategory === category.SubCategory ? `4px solid ${theme.palette.basecolorCode.main}` : 'none',
                        backgroundColor: activeCategory === category.SubCategory ? `${theme.palette.basecolorCode.main}15` : 'transparent',
                        color: activeCategory === category.SubCategory ? theme.palette.basecolorCode.main : theme.palette.lightblackcolorCode.main,
                        '& .MuiListItemIcon-root': {
                          color: activeCategory === category.SubCategory ? theme.palette.basecolorCode.main : 'inherit',
                        },
                        '&:hover': {
                          backgroundColor: `${theme.palette.basecolorCode.main}15`,
                          color: theme.palette.basecolorCode.main
                        },
                      }}
                    >
                      <Avatar src={category.ImagePath ? ImagePathRoutes.SubCategoryImagePath + category.ImagePath : "https://www.healthysteps.in/categoryimages/All-categories.png"} alt={category.SubCategory} />
                      <IconLabel>{category.SubCategory}</IconLabel>
                    </ListItemStyled>
                  ))}
                </List>
              </Drawer>
            </Grid>
            :
            <></>
          } */}

          {/* Right-side Content Area */}
          <Grid item xs={offerProducts === null && relatedProducts === null && newProducts === null ? 9.5 : 12} md={offerProducts === null && relatedProducts === null && newProducts === null ? 10 : 12}>
            <Grid container sx={{ px: { xs: 0, md: 0 }, justifyContent: "flex-start" }}>
              
              {/* Premium Category Header */}
              <Box sx={{ 
                width: '100%', 
                mb: 4, 
                p: { xs: 3, md: 5 }, 
                borderRadius: '24px', 
                backgroundColor: theme.palette.shadowcolorCode?.main || '#fdf5f5',
                display: "flex", 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: "space-between", 
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: { xs: 3, md: 0 }
              }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    backgroundColor: theme.palette.basecolorCode.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocalDiningIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.5, color: theme.palette.lightblackcolorCode.main }}>
                      Farm Fresh Selection
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 24, md: 36 }, fontFamily: "inherit", fontWeight: 800, color: theme.palette.lightblackcolorCode.main, textTransform: 'capitalize' }} variant="h1">
                      {activeCategory ? activeCategory : subCategoryName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ minWidth: { xs: '100%', md: 250 } }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1, ml: 1 }}>
                    SORT BY
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      id="productFilter"
                      value={productFilterName}
                      size="small"
                      sx={{ 
                        textAlign: "left", 
                        borderRadius: '30px', 
                        backgroundColor: '#fff',
                        fontWeight: 600,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                        }
                      }}
                      onChange={handleProductFilterChange}
                    >
                      <MenuItem value={"All products"}>Featured Items</MenuItem>
                      <MenuItem value={"Price(Low > High)"}>Price (Low to High)</MenuItem>
                      <MenuItem value={"Price(High > Low)"}>Price (High to Low)</MenuItem>
                      <MenuItem value={"Alphabetical"}>Alphabetical (A-Z)</MenuItem>
                      <MenuItem value={"Alphabetical Reverse"}>Alphabetical (Z-A)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Render filtered product list */}
              <div className={offerProducts === null && relatedProducts === null && newProducts === null ? "grid h-full w-full grid-cols-2 content-start gap-x-3 overflow-auto md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 pb-24 no-scrollbar" : "grid h-full w-full grid-cols-2 content-start gap-x-3 overflow-auto md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-24 no-scrollbar"}>
                {filteredProductLists.length > 0 ? (
                  filteredProductLists.map((product, index) => (
                    <Box key={product.Id || product.Productid || index} sx={{ mb: 3 }}>
                      <ProductCard product={product} isLoading={loading} offerProducts={offerProducts} relatedProducts={relatedProducts} newProducts={newProducts} />
                    </Box>
                  ))
                ) : (
                  !backdropOpen && (
                    <Typography
                      variant="h6"
                      sx={{ mt: 3, width: '100%', textAlign: 'center', color: theme.palette.basecolorCode.main }}
                    >
                      No products available.
                    </Typography>
                  )
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductList;
