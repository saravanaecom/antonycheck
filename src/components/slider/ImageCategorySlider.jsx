import React from 'react';
import Slider from "react-slick";
import { Container, Box, Grid } from '@mui/material';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';

export default function ImageCategorySlider({ CategoryImageLists = [] }) {
  if (!CategoryImageLists || CategoryImageLists.length === 0) {
    return null;
  }

  // Filter and flatten the image list
  const images = CategoryImageLists.flatMap((item) =>
    [item.Bannerimg1, item.Bannerimg2, item.Bannerimg3, item.Bannerimg4]
      .filter(img => img && (img !== "Undefined.jpg" || img !== "Undefined.png"))
  );

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{px: { xs: 0, sm: 0, md: 0, lg: 0 } }}
    >
      {images.length > 2 ? (
        <Slider {...settings}>
          {images.map((img, imgIndex) => (
            <Box
              key={imgIndex}
              sx={{ textAlign: 'center', pt: 3 }}
            >
              <Box
                component="img"
                sx={{
                  height: {
                    xs: 180,
                    sm: 200,
                    md: 250,
                    lg: 260,
                  },
                  width: "100%",
                  display: 'block',
                  margin: '0 auto',
                  padding: { xs: "0px 0px", sm: "0px 0px", md: "0px 5px", lg: "0px 10px", xl: "0px 10px" },
                  borderRadius: '0px'
                }}
                src={ImagePathRoutes.CategoryImagePath + img}
                alt={`Image ${imgIndex + 1}`}
              />
            </Box>
          ))}
        </Slider>
      ) : (
        <Grid container spacing={2}>
          {images.map((img, imgIndex) => (
            <Grid item xs={12} sm={6} md={images.length === 2 ? 6 : 12} key={imgIndex}>
              <Box
                component="img"
                sx={{
                  height: {
                    xs: 180,
                    sm: 200,
                    md: 225,
                    lg: 250,
                  },
                  width: "100%",
                  display: 'block',
                  margin: '0 auto',
                  padding: "0px 10px",
                  borderRadius: '0px'
                }}
                src={ImagePathRoutes.CategoryImagePath + img}
                alt={`Image ${imgIndex + 1}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
