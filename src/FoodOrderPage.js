import React, { useState, useEffect } from 'react';
import { Box, Container, useMediaQuery, useTheme, Dialog, DialogContent, Typography, Slide } from '@mui/material';
import { CheckCircle, Warning, Info } from '@mui/icons-material';
import MobileHeader from './components/MobileHeader';
import SearchFilter from './components/SearchFilter';
import MobileDishCard from './components/MobileDishCard';
import MobileCart from './components/MobileCart';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { playWelcomeChime } from './components/sounds'; // Import the sound utility

function FoodOrderPage({ restaurant, onBack, hotel_in_url, tableNo,section }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const discountPercent = (Number(restaurant.online_order_discounts) / 100);
  const [filter, setFilter] = useState({ type: 'all', value: 'all' });
  const restaurantUPI = restaurant['UPI_ID'] //'8380888360@pthdfc';
  const restaurantAddress = restaurant['address'] 
  const restaurantName = restaurant['name']
  const restaurantExpectedDeliveryTime = restaurant['expectedDeliveryTime']
  const [showWelcome, setShowWelcome] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [menuItems, setmenuItems] = useState([]);
  const pricetype = restaurant.Price_online_order || 'online_price'; // Use online_price or full_price based on restaurant settings
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOriginalPrice = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const [showconfirmorder, setshowconfirmorder] = useState('')

  useEffect(() => {
    console.log("Restaurant Name:", restaurantName,restaurantUPI,restaurantAddress,restaurantName,restaurantExpectedDeliveryTime);
    console.log("Hotel data from URL:", restaurant);
    // Check if user details are saved in localStorage
      fetchTableAndMenuData();
  }, []);

  // Effect for welcome animation
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Effect for order confirmation animation
  useEffect(() => {
      const timer = setTimeout(() => {
        setshowconfirmorder("");
      }, 5000);
      return () => clearTimeout(timer);
  }, [showconfirmorder]);


  // useEffect(() => {
  //   // Extract hotel_name from URL query parameters without useLocation
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);

  //   // get menu hotel name
  //   const nameFromUrl = urlParams.get('hotel_name');
  //   if (!restaurantName && nameFromUrl) {
  //     const formattedName = nameFromUrl
  //       .replace(/_/g, ' ')
  //       .replace(/\b\w/g, char => char.toUpperCase());
      
  //     setHotelName(formattedName);
  //   }

  //   // get menu type
  //   const menutypeFromUrl = urlParams.get('menu_type');
  //   if (menutypeFromUrl) {
  //     setMenuType(menutypeFromUrl);
  //   }

  //   const savedDetails = localStorage.getItem('userDetails');
  //   if (savedDetails) {
  //     const details = JSON.parse(savedDetails);
  //     setUserDetails(details);
  //     setShowWelcome(true);
  //     playWelcomeChime(); 
      
  //     // Auto-hide after 3 seconds
  //     const timer = setTimeout(() => {
  //       setShowWelcome(false);
  //     }, 3000);
      
  //     return () => clearTimeout(timer);
  //   }
    
  //   console.log("Hotel Name from URL:", hotelName);
  //   console.log("Menu Type from URL:", menuType);

  // },[restaurantName, hotelName, menuType]); // Add name to dependency array



  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateCartItemQuantity(item.id, existingItem.quantity + 1);
    } else {
      const currentPrice = Number(item[pricetype]);
      const originalPrice = (currentPrice / (1 - discountPercent));
      setCart([...cart, {
        ...item,
        price: currentPrice,
        originalPrice: Math.round(originalPrice),
        quantity: 1
      }]);
      
    }
  };

  const removeFromCart = (itemId) => {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // In FoodOrderPage.js
  const filteredItems = menuItems.filter(item => {
    // Filter by type
    const typeMatch = (
      filter.type === 'all' || 
      (filter.type === 'veg' && item.type === 'veg') ||
      (filter.type === 'non-veg' && item.type === 'non-veg') ||
      (filter.type === 'menu' && item.menu === filter.value)
    );

    // Filter by search query
    const searchMatch = searchQuery === '' || 
      (item.menu && item.menu.toString().toLowerCase().includes(searchQuery.toLowerCase())) || 
      (item.submenu && item.submenu.toString().toLowerCase().includes(searchQuery.toLowerCase()));
    
    return typeMatch && searchMatch;
  });

    const fetchTableAndMenuData = async () => {
    try {
      // console.log("Hotel Name from URL:", restaurant);
      // console.log("Fetching menu data from:", `https://api2.nextorbitals.in/api/get_menu.php?hotel_name=${restaurant.login_user}`);
      const [menuItems] = await Promise.all([
        fetch(`https://api2.nextorbitals.in/api/get_menu.php?hotel_name=${restaurant.login_user}`),
      ]);

      const tableData = await menuItems.json();
      
      // await initDB();  //initialization indexdb
      // console.log("tableData",tableData);
      setmenuItems(tableData.data || []); // Set menu items from fetched data
      // localStorage.setItem("tables", JSON.stringify(tableData.data));

    } catch (error) {
      console.error("Error fetching table and menu data:", error);
    }
  };




  return (
    <Box sx={{ 
      pb: isMobile ? '80px' : '100px',
      pt: isMobile ? '56px' : '64px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 10 }}
            sx={{
              position: 'fixed',
              top: '20%',
              left: 0,
              right: 0,
              zIndex: 9999,
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            <Slide direction="down" in={showWelcome} mountOnEnter unmountOnExit>
              <Box sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 3,
                mx: 'auto',
                maxWidth: '80%',
                boxShadow: 24,
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Welcome back, {userDetails?.name.split(' ')[0]}! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We're happy to see you again
                </Typography>
              </Box>
            </Slide>
          </Box>
        )}
      </AnimatePresence>

      {/* Order Status Confetti */}
      <AnimatePresence>
        {showconfirmorder === "Accepted" && (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.2}
            />
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: 'spring', damping: 10 }}
              sx={{
                position: 'fixed',
                top: '20%',
                left: 0,
                right: 0,
                zIndex: 9999,
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <Slide direction="down" in={showconfirmorder} mountOnEnter unmountOnExit>
                <Box sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 3,
                  mx: 'auto',
                  maxWidth: '80%',
                  boxShadow: 24,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Order Accepted! 🎉
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your order is being prepared
                  </Typography>
                </Box>
              </Slide>
            </Box>
          </>
        )}
      </AnimatePresence>

      {/* Order Confirmation Dialog */}
      <Dialog open={showconfirmorder.includes('rejected')} fullWidth maxWidth="sm">
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            { showconfirmorder === "Accepted" ? (
              <>
                <CheckCircle sx={{ fontSize: 80, color: 'green', mb: 2 }} />
                <Typography variant="h5" gutterBottom>Order Placed Successfully!</Typography>
                <Typography>Your order has been confirmed.</Typography>
              </>
            ) : (
              <>
                <CheckCircle sx={{ fontSize: 80, color: 'green', mb: 2 }} />
                <Typography variant="h5" gutterBottom>Order {showconfirmorder}!</Typography>
                <Typography>
                  {showconfirmorder === 'Accepted' 
                    ? 'The restaurant has accepted your order.' 
                    : 'There was an issue with your order.'}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <MobileHeader 
        name={restaurant.name} 
        address={restaurant.address || ''} 
        onBack={onBack}
        hotel_in_url={hotel_in_url}
        tableNo={tableNo} // Pass the table number to MobileHeader
        section={section}
      />

      <Container maxWidth="sm" sx={{ px: isMobile ? 2 : 3 }}>
          <Box sx={{ my: 2 }}>
          <SearchFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
              restaurantName={restaurantName}
              isMobile={isMobile}
              menuItems={menuItems}
          />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredItems.map(item => (
            <MobileDishCard 
              section={section}
              tableNo={tableNo}
              restaurant={restaurant}
              key={item.id}
              item={item}
              pricetype={pricetype}
              addToCart={addToCart}
              isInCart={cart.some(cartItem => cartItem.id === item.id)}
              removeFromCart={removeFromCart}
              discountPercent={discountPercent}
              isMobile={isMobile}
              cart={cart} // Pass cart state
              updateCartItemQuantity={updateCartItemQuantity} // Pass update function
              setshowconfirmorder={setshowconfirmorder}
            />
          ))}
          </Box>
        </Container>
        
        <MobileCart 
            section={section}
            tableNo={tableNo}
            restaurant={restaurant}
            totalItems={totalItems} 
            totalPrice={totalPrice} 
            cartItems={cart}
            setCart={setCart}
            totalOriginalPrice={totalOriginalPrice} // Pass totalOriginalPrice
            removeFromCart={removeFromCart}
            updateCartItemQuantity={updateCartItemQuantity} // Pass update function
            isMobile={isMobile}
            restaurantUPI={restaurantUPI}
            expectedDeliveryTime={restaurantExpectedDeliveryTime} // Pass expected delivery time
            setshowconfirmorder={setshowconfirmorder}
        />
    </Box>
  );
}

export default FoodOrderPage;

