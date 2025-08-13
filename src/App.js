import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box,
  CircularProgress,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Button,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FoodOrderPage from './FoodOrderPage'; // Import your FoodOrderPage component
import { Details } from '@mui/icons-material';

const RestaurantListWithAPI = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [hotel_in_url, sethotel_in_url] = useState(null);
  const [tableNo, setTableNo] = useState(0);
  const [section, setSection] = useState('');

  // Extract hotel_name from URL
  // Fetch restaurants images
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const nameFromUrl = params.get('hotel_name');
        if (nameFromUrl) {
          // console.log(`Hotel name from URL: ${nameFromUrl}`);
          sethotel_in_url(nameFromUrl);
        }
        let url = 'https://nextorbitals.in/images/get_image_list.php';
        // console.log(`Fetching restaurants from: ${url}`);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        
        // Ensure we always work with an array
        let restaurantsData = Array.isArray(data) ? data : [data];
        // Handle case where response might be an object with nested array
        // console.log("Fetched Restaurants Data:", restaurantsData);
        localStorage.setItem('server_images', JSON.stringify(restaurantsData));

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch restaurants hoteldata
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const nameFromUrl = params.get('hotel_name');
        const sectionFromUrl = params.get('section');
        const tableNoFromUrl = params.get('table_no');
        if (nameFromUrl) {
          console.log(`Hotel name from URL: ${nameFromUrl}`);
          sethotel_in_url(nameFromUrl);
          setSection(sectionFromUrl)
          setTableNo(tableNoFromUrl); // Set default table number to 1 if hotel_name is present
        }
        let url = 'https://api2.nextorbitals.in/api/save_hotel_details.php';
        try {
          if (nameFromUrl) {
            url += `?hotel_name=${nameFromUrl}`;
            console.log(`Constructed URL: ${url} with hotel_name:${nameFromUrl}and section:${sectionFromUrl} table no:${tableNoFromUrl}`);
          }
        } catch (error) {
          console.error("Error constructing URL:", error);
        }
        console.log(`Fetching restaurants from: ${url}`);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        
        // Ensure we always work with an array
        let restaurantsData = Array.isArray(data) ? data : [data];
        
        // Handle case where response might be an object with nested array
        if (!Array.isArray(restaurantsData)) {
          if (restaurantsData.hoteldata) {
            restaurantsData = [restaurantsData];
          } else {
            throw new Error("Unexpected API response format");
          }
        }

        const transformedRestaurants = restaurantsData.map((item, index) => {
          // Handle both direct hotel objects and nested hoteldata
          const hotel = item.hoteldata || item;
          // console.log(`Processing hotel: ${hotel.hotelName} || Hotel ${index + 1} , Hotel ${item.hotelName}`);
          return { // Contains all original data
            id: index + 1,
            name: hotel.hotelName || `Hotel ${index + 1}`,
            cuisine: "Various cuisines",
            rating: parseFloat((4.0 + (Math.random() * 0.5)).toFixed(1)),
            deliveryTime: `${30 + (index * 5)}-${40 + (index * 5)} Mins`,
            distance: `${(0.0).toFixed(1)} km`,
            discount: `Upto ${hotel.online_order_discounts}% off`,
            online_order_discounts: hotel.online_order_discounts,
            image: hotel.logo || "https://via.placeholder.com/100?text=Hotel",
            address: hotel.address || "Address not available",
            expectedDeliveryTime: `${hotel.minimum_preparation_time} minutes`,
            UPI_ID: hotel.UPI_ID || "default@upi",
            login_user: item.hotelName || "User",
            deliveryCharges: hotel.deliveryCharges || 0,
            delivery_timing_from_1: hotel.delivery_timing_from_1 || "10:00 AM",
            delivery_timing_to_1: hotel.delivery_timing_to_1 || "10:00 PM",
            delivery_timing_from_2: hotel.delivery_timing_from_2 || "10:00 AM",
            delivery_timing_to_2: hotel.delivery_timing_to_2 || "10:00 PM",
            minimum_preparation_time: hotel.minimum_preparation_time || "15 minutes",
            mobile: hotel.mobile || "0000000000",
            online_payment_accepted: hotel.online_payment_accepted || "Yes",
            tax: hotel.tax || "5%",
            Price_online_order: hotel.Price_online_order || 0,
          };
        });

        setRestaurants(transformedRestaurants);
        
        if (nameFromUrl && transformedRestaurants.length > 0) {
          console.log(`Setting selected restaurant to navigate: ${transformedRestaurants[0]}`);
          setSelectedRestaurant(transformedRestaurants[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    // Update URL without page reload
    // navigate(`?hotel_name=${encodeURIComponent(restaurant.name)}`, { replace: true });
  };

  const handleBackToList = () => {
    setSelectedRestaurant(null);
    // Clear the hotel_name from URL when going back
    // navigate('', { replace: true });
  };

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error" variant="h6">
          Error loading restaurants: {error}
        </Typography>
      </Box>
    );
  }

  if (selectedRestaurant) {
    console.log(`Hotel name from URL selectedRestaurant:${hotel_in_url}`);
    return (
      <FoodOrderPage 
        restaurant={selectedRestaurant} 
        onBack={handleBackToList}
        hotel_in_url={hotel_in_url}
        tableNo={tableNo} // Pass the table number to FoodOrderPage
        section={section}
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ px: 2, py: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        color: theme.palette.primary.main,
        fontSize: '1.5rem'
      }}>
        Start Ordering from ONDC
      </Typography>
      
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
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredRestaurants.map(restaurant => (
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
            onClick={() => handleRestaurantSelect(restaurant)}
          >
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ width: 100, height: 100, minWidth: 100 }}>
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
                />
              </Box>

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

export default RestaurantListWithAPI;