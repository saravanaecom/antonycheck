import BannerSlider from "../components/slider/BannerSlider";
import ImageCategorySlider from "../components/slider/ImageCategorySlider";
import OfferFastMovingProduct from "../components/slider/offerFastMovingProduct";
// import ProductByIndexPage from '../components/slider/productByIndexPage';
import { Container } from '@mui/material';
import ShippingSection from "../components/slider/ShippingSection";
import ProductShow from "../components/slider/productShow";


export default function HomePage() {
    return (
        <>
            <Container maxWidth="xl">
             <BannerSlider  />   
             {/* <ShippingSection/> */}
             <ProductShow/>
            <OfferFastMovingProduct/>            
            <ImageCategorySlider /> 
                {/* <ProductByIndexPage/> */}
              
            </Container>
        </>
    )
};