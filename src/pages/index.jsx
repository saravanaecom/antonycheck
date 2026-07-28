import PremiumHeroBanner from "../components/home/PremiumHeroBanner";
import PremiumProductShowcase from "../components/home/PremiumProductShowcase";
import PremiumTrendingOffers from "../components/home/PremiumTrendingOffers";
import PremiumNewArrivals from "../components/home/PremiumNewArrivals";
import PremiumCategoryShowcase from "../components/home/PremiumCategoryShowcase";
import PremiumOurProducts from "../components/home/PremiumOurProducts";
import ImageCategorySlider from "../components/slider/ImageCategorySlider";
import { Container, Box } from '@mui/material';

export default function HomePage() {
    return (
        <Box sx={{ overflowX: 'hidden' }}>
            <Container maxWidth="xl">
                <PremiumHeroBanner />   
                
                <Box sx={{ my: 8 }}>
                    <ImageCategorySlider /> 
                </Box>

                <PremiumTrendingOffers />            
                <PremiumProductShowcase />
                <PremiumCategoryShowcase />
                <PremiumNewArrivals />
                <PremiumOurProducts />
            </Container>
        </Box>
    )
};