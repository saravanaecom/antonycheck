import { createTheme } from '@mui/material/styles';

export const ThemeSettings = (themeLists = {}) => {
  return createTheme({
    typography: {
      fontFamily: "'Barlow', sans-serif",
    },
    paletteSecondary: {
      basecolorCode: {
        main: themeLists.basecolorCode,
        secondary: themeLists.basecolorCode,
      },
      colorCode: {
        main: themeLists.colorCode,
        secondary: themeLists.colorCode,
      },
      lightblackcolorCode: {
        main: themeLists.lightblackcolorCode,
      },
      shadowcolorCode: {
        main: themeLists.shadowcolorCode,
      },
      whitecolorCode: {
        main: themeLists.whitecolorCode,
      },
      footertextcolorCode: {
        main: '#9ca3af'
      }
    },
    palette: {
      basecolorCode: {
        main: themeLists.basecolorCode || '#D32F2F',
        secondary: themeLists.basecolorCode || '#d32f2f1c',
      },
      colorCode: {
        main: themeLists.colorCode || '#212121',
        secondary: themeLists.colorCode || '#424242',
      },
      lightblackcolorCode: {
        main: themeLists.lightblackColorCode || '#212121',
      },
      shadowcolorCode: {
        main: themeLists.shadowcolorCode || '#d32f2f1c',
      },
      whitecolorCode: {
        main: themeLists.whitecolorCode || '#FFF',
      },
      footertextcolorCode: {
        main: '#FFF'
      }
    },
  });
};

export default ThemeSettings;