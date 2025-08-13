// src/components/MobileDishCard.jsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Stack, 
  Chip,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { findBestImageMatch } from '../utils/imageMatcher';


const MobileDishCard = ({section, tableNo, restaurant, item, addToCart, pricetype, isInCart, removeFromCart, discountPercent, isMobile,  cart, updateCartItemQuantity, setshowconfirmorder }) => {
  // Calculate discounted price (original price + 20)
  const currentPrice = Number(item[pricetype]);
  const originalPrice = (currentPrice / (1 - discountPercent));
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  // Get stored images from localStorage and Find the best matching image
  const storedImages = JSON.parse(localStorage.getItem('server_images') || '[]');
  // console.log("Image name found:", item.submenu,item);
  const imageName = findBestImageMatch(item.submenu, storedImages);
  const imageUrl = `https://nextorbitals.in/images/${imageName}`;
  // console.log("Image name found:", imageUrl);

  if (item.available === 0) {
    return null;
  }


  return (
    <Card elevation={0} sx={{ 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 2,
      position: 'relative'
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            variant="rounded"
            src={imageUrl}
            sx={{ 
              width: 80, 
              height: 80,
              borderRadius: 1
            }}
          />
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', // This will push items to opposite ends
              mb: 0.5,
              width: '100%' // Ensure the container takes full width
            }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'bold',
                  whiteSpace: 'wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1, // Allow text to take available space
                  mr: 1 // Add some right margin
                }}
              >
                {item.submenu} - {item.menu}
              </Typography>

              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: item.type === 'veg' ? '#8B4513' : '#4CAF50', // Fixed colors (green for veg)
                  border: '1px solid',
                  borderColor: item.type === 'veg' ? '#8B4513' : '#4CAF50',
                  flexShrink: 0 // Prevent the indicator from shrinking
                }}
              />
            </Box>
            <Typography 
                variant="subtitle3" 
                sx={{ 
                  whiteSpace: 'wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1, // Allow text to take available space
                  mr: 1, // Add some right margin
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                {item.description || 'No description available'}
              </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1
              }}
            >
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                ¥{Math.round(currentPrice)}
              </Typography>
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                ¥{Math.round(originalPrice)}
              </Typography>
              {discount > 0 && (
                <Chip 
                  label={`${discount}% OFF`} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'primary.light',
                    color: 'primary.dark'
                  }} 
                />
              )}
            </Stack>
            
            {isInCart ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                maxWidth: 95,
                backgroundColor: 'cornflowerblue',
                borderRadius: '8px',
                p: 0.1,
                boxShadow: 1,
              }}>
                <IconButton 
                  size="small" 
                  onClick={() => {
                    const currentQty = cart.find(cartItem => cartItem.id === item.id)?.quantity || 0;
                    if (currentQty > 1) {
                      updateCartItemQuantity(item.id, currentQty - 1);
                    } else {
                      removeFromCart(item.id);
                    }
                  }}
                  sx={{ 
                    p: 0.5,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mx: 1,
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}
                >
                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 1}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => {
                    const currentQty = cart.find(cartItem => cartItem.id === item.id)?.quantity || 0;
                    updateCartItemQuantity(item.id, currentQty + 1);
                  }}
                  sx={{ 
                    p: 0.5,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => addToCart(item)}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 1,
                  py: 0.5
                }}
              >
                Add
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MobileDishCard;