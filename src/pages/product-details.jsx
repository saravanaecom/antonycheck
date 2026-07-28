/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Container, Grid, Typography, FormControl, Select, MenuItem, Button, CircularProgress, Backdrop, IconButton, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NoImage from '../assets/no-image.png';
import { ServerURL } from '../server/serverUrl';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import { API_FetchProductById } from '../services/productListServices';
import RelatedProducts from '../components/slider/relatedProducts';
import BreadCrumbs from '../components/BreadCrumbs';
import { API_InsertMyFavoriteProducts, API_FetchMyFavoriteProducts, API_DeleteMyFavoriteProducts } from '../services/userServices';
import { useCart } from '../context/CartContext';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import * as actionType from '../redux/actionType';

const ProductDetails = (props) => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [productId, setProductId] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productDetails, setProductDetails] = useState({});
    const [imageLists, setImageLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const { cartItems, setCartItems } = useCart();
    const [productValue, setProductValue] = useState(0);
    let [isFavoriteProduct, setIsFavoriteProduct] = useState(0);

    const [productWeight, setProductWeight] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedMRP, setselectedMRP] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);

    const GetProductDetails = async (productId) => {
        try {
            setLoading(true);
            setBackdropOpen(true);
            const fetchedProductDetails = await API_FetchProductById(productId);
            if (Array.isArray(fetchedProductDetails) && fetchedProductDetails.length > 0) {
                const product = fetchedProductDetails[0];
                setProductDetails(product);
                setTotalPrice(product.Price);

                // Filter and flatten the image list
                const images = [product.Img0, product.Img1, product.Img2]
                    .filter(img => img && img !== "Undefined.jpg" && img !== "Undefined.png");
                setImageLists(images);

                //Fav product load
                const selectedFavList = props.get_fav_lists.find(item => item.Id === Number(productId));
                if (selectedFavList !== undefined && selectedFavList.length !== 0) {
                    setIsFavoriteProduct(1);
                }
                else {
                    setIsFavoriteProduct(0);
                }

            } else {
                setProductDetails({});
                setImageLists([]);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            setProductDetails({});
            setImageLists([]);
        } finally {
            setLoading(false);
            setBackdropOpen(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodedId = queryParams.get('pdid');
        const productId = encodedId ? decodeURIComponent(encodedId) : null;
        setProductId(atob(productId));
        if (productId) {
            GetProductDetails(atob(productId));           
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, props.get_fav_lists]);

    const handleProductWeightChange = (event, ProductWeightLists) => {
        event.stopPropagation();

        const selectedWeightId = event.target.value;
        const selectedWeight = ProductWeightLists.find(item => item.WeightType === selectedWeightId);
        if (selectedWeight) {
            setProductWeight(selectedWeight.WeightType);
            setTotalPrice(selectedWeight.SaleRate);
            setSelectedPrice(selectedWeight.SaleRate);
            setCurrentPrice(selectedWeight.SaleRate);
            setselectedMRP(selectedWeight.MRP);

            const newTotalPrice = quantity * (selectedWeight.SaleRate);
            const newMRP = quantity * (selectedWeight.MRP);
            updateCartItems(quantity, newTotalPrice, newMRP, selectedWeight.SaleRate);
        }
    };

    useEffect(() => {
        if (productDetails && productDetails.ProductWeightType && productDetails.ProductWeightType.length > 0) {
            const firstWeight = productDetails.ProductWeightType[0];
            if (firstWeight && firstWeight.WeightType) {
                setProductWeight(firstWeight.WeightType);
            }
        }
    }, [productDetails]);


    // Check if the product exists in cartItems
    useEffect(() => {
        const hasVariants = productDetails?.MultiplePriceEnable === 1 && productDetails?.ProductWeightType?.length > 0;
        const existingProduct = cartItems.find(item => {
            const itemId = item?.Productid ? item.Productid : item?.Id;
            const productId = productDetails?.Productid ? productDetails.Productid : productDetails?.Id;
            if (hasVariants) {
                return itemId === productId && item.UnitType === productWeight;
            }
            return itemId === productId;
        });

        if (existingProduct) {
            setQuantity(existingProduct.item);
            setTotalPrice(existingProduct.totalPrice);
            setCurrentPrice(existingProduct.totalPrice);
        } else {
            setQuantity(0);
            setTotalPrice(selectedPrice > 0 ? selectedPrice : productDetails?.Price || 0);
            setCurrentPrice(selectedPrice > 0 ? selectedPrice : productDetails?.Price || 0);
        }
    }, [cartItems, productDetails, selectedPrice, productWeight]);

    // Update cartItems function
    const updateCartItems = (newQuantity, newTotalPrice, MRP, selected_price) => {
        setCartItems(prevCartItems => {
            const updatedCartItems = [...prevCartItems];
            const productId = productDetails?.Productid ? productDetails.Productid : productDetails?.Id;
            const hasVariants = productDetails?.MultiplePriceEnable === 1 && productDetails?.ProductWeightType?.length > 0;

            const existingProductIndex = updatedCartItems.findIndex(item => {
                const itemId = item?.Productid ? item.Productid : item?.Id;
                if (hasVariants) {
                    return itemId === productId && item.UnitType === productWeight;
                }
                return itemId === productId;
            });

            if (existingProductIndex >= 0) {
                if (newQuantity > 0) {
                    // Update existing product in the cart
                    updatedCartItems[existingProductIndex] = {
                        ...updatedCartItems[existingProductIndex],
                        item: newQuantity,
                        totalPrice: newTotalPrice,
                        totalMRP: MRP,
                        selectedPrice: selected_price,
                        selectedMRP: MRP,
                        UnitType: hasVariants ? productWeight : productDetails?.UnitType
                    };
                } else {
                    // Remove product if the quantity is zero
                    updatedCartItems.splice(existingProductIndex, 1);
                }
            } else if (newQuantity > 0) {
                // Add new product to the cart
                updatedCartItems.push({
                    ...productDetails,
                    item: newQuantity,
                    totalPrice: newTotalPrice,
                    totalMRP: MRP,
                    selectedPrice: selected_price,
                    selectedMRP: MRP,
                    UnitType: hasVariants ? productWeight : productDetails?.UnitType
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });
    };


    // Quantity increment function
    const handleIncrement = (event) => {
        event.stopPropagation();
        const newQuantity = quantity + 1;
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : productDetails.Price);
        const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : productDetails.MRP);

        setQuantity(newQuantity);
        setTotalPrice(newTotalPrice);
        setCurrentPrice(newTotalPrice);
        updateCartItems(newQuantity, newTotalPrice, MRP);
    };

    // Quantity decrement function
    const handleDecrement = (event) => {
        event.stopPropagation();
        const newQuantity = quantity - 1;
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : productDetails.Price);
        const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : productDetails.MRP);

        if (newQuantity === 0) {
            setQuantity(0);
            setTotalPrice(selectedPrice > 0 ? selectedPrice : productDetails.Price);
            updateCartItems(0, selectedPrice > 0 ? selectedPrice : productDetails.Price, MRP);
        } else if (quantity > 0) {
            setQuantity(newQuantity);
            setTotalPrice(newTotalPrice);
            setCurrentPrice(newTotalPrice);
            updateCartItems(newQuantity, newTotalPrice, MRP);
        }
    };

    //Add fav product
  const handleAddFavProduct = async (ProductId, event, status) => {
    event.stopPropagation();
    setIsFavoriteProduct(1);
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      const response = await API_InsertMyFavoriteProducts(ProductId,  Number(atob(userId)));
      if (response.DeleteStatus === 0 && response.ItemmasterRefid !== 0) {
        await FetchMyFavoriteProducts(atob(userId));
        setIsFavoriteProduct(1);
      }
      else{
        setIsFavoriteProduct(0);
      }
    } catch (error) {
      setIsFavoriteProduct(0);
    }
  };

  const FetchMyFavoriteProducts = async (userId) => {
    try {
        const favlist = await API_FetchMyFavoriteProducts(userId);
        if(favlist !== undefined && favlist.length !== 0){
          props.setFavouriteLists(favlist);
        }        
    } catch (error) {
        console.error("Error fetching favorite product lists:", error);
    }
};

  //Remove fav list
  const handleRemoveFavProduct = async (ProductId, event) => {
    event.stopPropagation();
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      const response = await API_DeleteMyFavoriteProducts(ProductId, Number(atob(userId)));
      if (response.DeleteStatus === 1 && response.ItemmasterRefid !== 0) {
        await FetchMyFavoriteProducts(atob(userId));
        setIsFavoriteProduct(0);
      }
    } catch (error) {
      setIsFavoriteProduct(1);
    }
  };

    const settings1 = {
        customPaging: function (index) {
            return (
                <Box sx={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid transparent',
                    transition: '0.3s',
                    '&:hover': {
                        borderColor: theme.palette.basecolorCode.main
                    }
                }}>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={imageLists[index] === '/productimages/Undefined.jpg' || imageLists[index] === '/productimages/Undefined.png' || imageLists[index] === null || imageLists[index] === '' ? NoImage : ImagePathRoutes.ProductImagePath + imageLists[index]} alt="Thumbnail" />
                </Box>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb custom-dots",
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
            <style>
                {`
                    .custom-dots {
                        display: flex !important;
                        justify-content: center;
                        gap: 15px;
                        margin-top: 20px;
                        position: relative;
                        bottom: -15px;
                    }
                    .custom-dots li {
                        width: 70px;
                        height: 70px;
                        margin: 0;
                    }
                    .custom-dots li.slick-active > div {
                        border-color: ${theme.palette.basecolorCode.main} !important;
                        box-shadow: 0 4px 12px ${theme.palette.basecolorCode.main}50;
                    }
                `}
            </style>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Container maxWidth="lg" sx={{ my: 4, mb: 10 }}>
                <Box sx={{ pb: 3 }}><BreadCrumbs CategoryId={productDetails.CId} CategoryName={productDetails.CategoryName} SubCateoryId={productDetails.SId} SubCategoryName={productDetails.SubCategoryName} ProductName={productDetails.Description} /></Box>
                
                {/* Main Product Container - Open Layout */}
                <Grid container spacing={{ xs: 4, md: 8 }} sx={{ p: { xs: 0, md: 2 } }}>
                    
                    {/* Left: Image Carousel with Spicy Gradient Background */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            position: 'relative', 
                            borderRadius: '32px', 
                            background: `linear-gradient(135deg, ${theme.palette.basecolorCode.main}08 0%, ${theme.palette.basecolorCode.main}15 50%, ${theme.palette.basecolorCode.main}08 100%)`,
                            border: `1px solid ${theme.palette.basecolorCode.main}20`,
                            p: { xs: 2, md: 4 },
                            pb: { xs: 6, md: 8 },
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            {/* Decorative Background Element */}
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '70%',
                                height: '70%',
                                background: 'radial-gradient(circle, rgba(214, 40, 40, 0.1) 0%, rgba(214, 40, 40, 0) 70%)',
                                borderRadius: '50%',
                                zIndex: 0
                            }} />

                            {Math.round(productDetails.Offer) > 0 && (
                                <Chip 
                                    icon={<LocalFireDepartmentIcon style={{ color: '#fff' }} />}
                                    label={`${Math.round(productDetails.Offer)}% OFF`} 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 24, 
                                        left: 24, 
                                        zIndex: 10,
                                        backgroundColor: theme.palette.basecolorCode.main,
                                        color: theme.palette.whitecolorCode.main,
                                        fontWeight: 800,
                                        fontSize: '15px',
                                        height: '36px',
                                        boxShadow: `0 8px 20px ${theme.palette.basecolorCode.main}60`
                                    }} 
                                />
                            )}
                            <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
                                <IconButton 
                                    onClick={(event) => isFavoriteProduct !== 0 ? handleRemoveFavProduct(productDetails?.Productid || productDetails?.Id, event) : handleAddFavProduct(productDetails?.Productid || productDetails?.Id, event, 'Add')}
                                    sx={{ 
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        width: 48,
                                        height: 48,
                                        transition: 'all 0.3s ease',
                                        '&:hover': { backgroundColor: '#ffeef0', transform: 'scale(1.1)' }
                                    }}
                                >
                                    {isFavoriteProduct !== 0 ? <FavoriteIcon sx={{ color: theme.palette.basecolorCode.main, fontSize: 28 }} /> : <FavoriteBorderIcon sx={{ color: theme.palette.basecolorCode.main, fontSize: 28 }} />}
                                </IconButton>
                            </Box>

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Slider {...settings1}>
                                    {imageLists.map((image, index) => (
                                        <Box key={index} sx={{ outline: 'none' }}>
                                            <img 
                                                style={{ 
                                                    width: '100%', 
                                                    height: { xs: '300px', md: '450px' }, 
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.15))',
                                                    mixBlendMode: 'multiply'
                                                }} 
                                                src={ImagePathRoutes.ProductImagePath + image === '/productimages/Undefined.jpg' || ImagePathRoutes.ProductImagePath + image === '/productimages/Undefined.png' || !image ? NoImage : ImagePathRoutes.ProductImagePath + image} 
                                                alt={productDetails.Description || "Product"} 
                                            />
                                        </Box>
                                    ))}
                                </Slider>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right: Product Info */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                            <Chip 
                                label="Premium Quality" 
                                size="small" 
                                sx={{ 
                                    width: 'fit-content',
                                    mb: 2,
                                    backgroundColor: `${theme.palette.basecolorCode.main}15`,
                                    color: theme.palette.basecolorCode.main,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }} 
                            />
                            
                            <Typography variant="h3" sx={{ 
                                fontSize: { xs: 28, md: 36 }, 
                                fontWeight: 800, 
                                color: theme.palette.lightblackcolorCode.main, 
                                mb: 2,
                                lineHeight: 1.2
                            }}>
                                {productDetails.Description || "Product Details"}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: theme.palette.basecolorCode.main,
                                    mr: 2
                                }}>
                                    {(currentPrice > 0 ? currentPrice : totalPrice).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2 })}
                                </Typography>
                                {productDetails.MRP && (
                                    <Typography variant="h6" sx={{ 
                                        textDecoration: 'line-through', 
                                        color: '#999',
                                        fontWeight: 400
                                    }}>
                                        {((selectedMRP > 0 ? selectedMRP : productDetails.MRP)).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2 })}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#666', mb: 1, textTransform: 'uppercase' }}>
                                    Select Quantity / Weight
                                </Typography>
                                {productDetails.MultiplePriceEnable === 0 ? (
                                    <Chip label={productDetails.UnitType} sx={{ fontWeight: 600, fontSize: 14, p: 1 }} />
                                ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {productDetails.ProductWeightType && productDetails.ProductWeightType.map((weight, index) => (
                                            <Button
                                                key={index}
                                                variant={productWeight === weight.WeightType ? "contained" : "outlined"}
                                                onClick={(e) => handleProductWeightChange({ target: { value: weight.WeightType }, stopPropagation: () => {} }, productDetails.ProductWeightType)}
                                                sx={{
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    px: 3,
                                                    py: 1,
                                                    borderColor: productWeight === weight.WeightType ? theme.palette.basecolorCode.main : '#e0e0e0',
                                                    backgroundColor: productWeight === weight.WeightType ? theme.palette.basecolorCode.main : 'transparent',
                                                    color: productWeight === weight.WeightType ? '#ffffff' : theme.palette.lightblackcolorCode.main,
                                                    '&:hover': {
                                                        filter: productWeight === weight.WeightType ? 'brightness(0.9)' : 'none',
                                                        backgroundColor: productWeight === weight.WeightType ? theme.palette.basecolorCode.main : '#f5f5f5',
                                                        borderColor: theme.palette.basecolorCode.main
                                                    }
                                                }}
                                            >
                                                {weight.WeightType}
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, pt: 2, borderTop: '1px dashed #e0e0e0' }}>
                                {productDetails.InStock !== 0 ? (
                                    quantity === 0 ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleIncrement}
                                            startIcon={<ShoppingCartIcon />}
                                            sx={{
                                                flex: 1,
                                                py: 1.5,
                                                borderRadius: '16px',
                                                fontSize: '18px',
                                                fontWeight: 800,
                                                textTransform: 'none',
                                                backgroundColor: theme.palette.basecolorCode.main,
                                                color: '#ffffff',
                                                boxShadow: `0 8px 24px ${theme.palette.basecolorCode.main}40`,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: theme.palette.basecolorCode.main,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 12px 30px ${theme.palette.basecolorCode.main}60`
                                                }
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    ) : (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: `${theme.palette.basecolorCode.main}08`, 
                                            borderRadius: '16px', 
                                            border: `2px solid ${theme.palette.basecolorCode.main}`,
                                            flex: 1,
                                            justifyContent: 'space-between',
                                            overflow: 'hidden'
                                        }}>
                                            <IconButton onClick={handleDecrement} sx={{ color: theme.palette.basecolorCode.main, p: 2, borderRadius: 0, '&:hover': { filter: 'brightness(0.9)', backgroundColor: `${theme.palette.basecolorCode.main}15` } }}>
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ fontSize: 20, fontWeight: 800, color: theme.palette.basecolorCode.main }}>
                                                {quantity}
                                            </Typography>
                                            <IconButton onClick={handleIncrement} sx={{ color: theme.palette.basecolorCode.main, p: 2, borderRadius: 0, '&:hover': { filter: 'brightness(0.9)', backgroundColor: `${theme.palette.basecolorCode.main}15` } }}>
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    )
                                ) : (
                                    <Button
                                        variant="contained"
                                        disabled
                                        sx={{
                                            flex: 1,
                                            py: 1.5,
                                            borderRadius: '16px',
                                            fontSize: '18px',
                                            fontWeight: 800,
                                            textTransform: 'none',
                                            backgroundColor: '#e0e0e0 !important',
                                            color: '#999 !important'
                                        }}
                                    >
                                        Out of Stock
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 700, mb: 1, color: theme.palette.lightblackcolorCode.main }}>
                                    <LocalDiningIcon sx={{ color: theme.palette.basecolorCode.main, mr: 1 }} /> The Tasty Details
                                </Typography>
                                <Typography sx={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>
                                    {productDetails.ProductDescription || "Our premium cuts are sourced fresh daily, ensuring the highest quality and taste for your meals. Perfectly seasoned, tender, and ready to be the star of your next dish."}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
                <Box sx={{ borderTop: '2px solid #f0f0f0', pt: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: theme.palette.lightblackcolorCode.main, textAlign: 'center' }}>
                        You Might Also Like
                    </Typography>
                    <Box sx={{ width: "100%", display: "inline-block" }}>
                        <RelatedProducts ProductId={productId} />
                    </Box>
                </Box>
            </Container>
        </>
    );
};


const mapStateToProps = (state) => {
    return {
      get_fav_lists: state.get_fav_lists, // Get favourite lists from Redux state (Wishlists)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {    
      setFavouriteLists: (data) => dispatch({type: actionType.GET_GLOBAL_FAVOURITE_LISTS, payload: data})
    };
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);