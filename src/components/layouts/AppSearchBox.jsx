/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Autocomplete, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { API_SearchByProduct } from '../../services/productListServices';

const AppSearchBox = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchLists, setSearchLists] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [SearchKeyword, setSearchKeyword] = useState('');

  const GetSearchByProducts = async (keyWord) => {
    try {
      const searchLists = await API_SearchByProduct(keyWord);
      setSearchLists(searchLists);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setIsLoading(false);
    }
  };

  const handleSearchProducts = (keyWord) => {
    setSearchKeyword(keyWord);
    if (keyWord.length > 1) {
      GetSearchByProducts(keyWord);
    }
  };

  // Handle native selection (Click or Enter key)
  const handleOptionSelect = (event, newValue) => {
    if (newValue) {
      const pdId = newValue.Productid ? newValue.Productid : newValue.Id;
      const pdValue = newValue.Description;
      setSearchLists([]);
      setSearchKeyword('');
      navigate(`/product-details?pdid=${encodeURIComponent(btoa(pdId))}&pdname=${encodeURIComponent(btoa(pdValue))}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Autocomplete
        freeSolo
        options={searchLists}
        getOptionLabel={(option) => option.Description}
        inputValue={SearchKeyword}
        onInputChange={(event, newValue) => handleSearchProducts(newValue)} 
        onChange={handleOptionSelect}
        renderInput={(params) => {
          // We must merge our custom InputProps with params.InputProps
          const { InputProps, ...restParams } = params;
          return (
            <TextField
              {...restParams}
              placeholder="Search for premium products..."
              variant="outlined"
              InputProps={{
                ...InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  ...InputProps.sx,
                  borderRadius: '50px',
                  backgroundColor: '#f5f5f5',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }
                }
              }}
              sx={{
                width: { xs: '100%', sm: '80%', md: '100%' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: '1px solid transparent',
                  },
                  '&:hover fieldset': {
                    border: '1px solid transparent',
                  },
                  '&.Mui-focused fieldset': {
                    border: `1px solid ${theme.palette.basecolorCode.main}`, 
                  },
                }
              }}
              autoComplete={"off"}
              size="small"
            />
          );
        }}
        renderOption={(props, option) => (
          <List {...props} key={option.Id} 
          id={option?.Productid ? option.Productid : option?.Id}
          name={option.Description}
          value={option?.Productid ? option.Productid : option?.Id}
          >
            <ListItem style={{ display: 'flex', alignItems: 'center', p: 0 }}>
              <ListItemAvatar>
                <Avatar src={ImagePathRoutes.ProductImagePath + option.Img0} alt={option.Description} />
              </ListItemAvatar>
              <ListItemText
                primary={option.Description}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {option.Price.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        )}
      />
    </div>
  );
};

export default AppSearchBox;
