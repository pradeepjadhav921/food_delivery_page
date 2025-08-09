// src/components/RestaurantList.js
import React from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const RestaurantList = ({ restaurants, onSelectRestaurant, searchQuery, setSearchQuery }) => {
  const theme = useTheme();
  
  
  return (
    <Container maxWidth="sm" sx={{ px: 2, py: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h5" sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        color: theme.palette.primary.main,
        fontSize: '1.5rem'
      }}>
        Start Ordering from ONDC
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ 
        mb: 2,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <input
          type="text"
          placeholder="Search Restaurant, dish, cuisine"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </Box>
      
      {/* Filter/Sort Row */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        my: 2,
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Restaurants near you</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="text" 
            size="small" 
            sx={{ 
              textTransform: 'none',
              color: theme.palette.text.primary,
              fontSize: '0.875rem'
            }}
          >
            Filter
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button 
            variant="text" 
            size="small" 
            sx={{ 
              textTransform: 'none',
              color: theme.palette.text.primary,
              fontSize: '0.875rem'
            }}
          >
            Sort by
          </Button>
        </Box>
      </Box>
      
      {/* Restaurant Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {restaurants.map(restaurant => (
          <Card 
            key={restaurant.id} 
            sx={{ 
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <Box sx={{ display: 'flex' }}>
              {/* Restaurant Image */}
              <Box sx={{ 
                width: 100, 
                height: 100, 
                minWidth: 100,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/100?text=Restaurant';
                  }}
                />
              </Box>

              {/* Restaurant Info */}
              <CardContent sx={{ 
                padding: '12px 16px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  mb: 0.5
                }}>
                  {restaurant.name}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  mb: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {restaurant.cuisine}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: restaurant.discount ? 1 : 0
                }}>
                  <Chip 
                    label={`★ ${restaurant.rating}`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: theme.palette.success.light,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      height: '20px'
                    }}
                  />
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}>
                    {restaurant.deliveryTime}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}>
                    •
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}>
                    {restaurant.distance}
                  </Typography>
                </Box>
                
                {restaurant.discount && (
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    {restaurant.discount}
                  </Typography>
                )}
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default RestaurantList;