// src/components/MobileCart.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Divider, 
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { ShoppingCart as CartIcon, Close as CloseIcon, Add as AddIcon,Remove as RemoveIcon,RemoveShoppingCartTwoTone } from '@mui/icons-material';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPercent, faGreaterThan,faTicket  } from '@fortawesome/free-solid-svg-icons';
import OrderConfirmation from './OrderConfirmation.jsx';


const MobileCart = ({ totalItems, totalPrice, cartItems,setCart, totalOriginalPrice, removeFromCart, updateCartItemQuantity, isMobile, restaurantUPI, expectedDeliveryTime }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  console.log("selected items",totalItems,cartItems,totalPrice,totalOriginalPrice);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Calculate savings (example calculation)
  const savings = totalOriginalPrice - totalPrice;
  const itemTotal = totalPrice;
  const deliveryCharges = 50;
  const convenienceFee = 2;
  const taxes = 0;
  const grandTotal = itemTotal + deliveryCharges + convenienceFee + taxes;

  const clear_cart = () => {
    setOrderOpen(false);
    setDrawerOpen(false); // Close the drawer
    // Clear the cart state
    setCart([]);
  };

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          zIndex: 1000
        }}
      >
        <Button 
          fullWidth
          variant="contained" 
          startIcon={
            <Badge badgeContent={totalItems} color="error">
              <CartIcon />
            </Badge>
          }
          onClick={toggleDrawer(true)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            py: 1.5,
            justifyContent: 'flex-start',
            pl: 2
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography variant="subtitle2">
              {totalItems} items | ₹{totalPrice.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 1)">
              Extra charges may apply
            </Typography>
          </Box>
          <Typography variant="subtitle2">
            View Cart
          </Typography>
        </Button>
      </Paper>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            height: '85vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 2,
            backgroundColor: '#f4f8fb',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Punjab Grill
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" 
          sx={{ mb: 0, 
          color: 'rgba(0, 0, 0, 1)',
          fontWeight: 700,

          }}>
            Expected Delivery in {expectedDeliveryTime} min
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {JSON.parse(localStorage.getItem('userDetails'))?.address || 'Please select address before place order'}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {cartItems.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '50vh'
            }}>
              <CartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                Your cart is empty
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ 
                backgroundColor: '#e2f6eb', 
                padding: '10px', 
                borderRadius: 3, 
                mb: 2,
                border: '2px solid #58a388',
                color: '#279359',
                wordSpacing: '0.01em',
                letterSpacing: '0.01em',
                textAlign: 'center',
                fontSize: '0.875rem'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                 <FontAwesomeIcon icon={faPercent} style={{ color: "#279359"}} /> Yay! You are saving ₹{savings} on this order
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Items added
              </Typography>
              <List dense sx={{
                mb: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 2,
                padding: 1
              }}>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ 
                      px: 2,
                      py: 1.5,
                      alignItems: 'center',
                      padding: '10px 0px',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center',padding: '0px',gap: 0 }}>
                            {/* Item name and submenu */}
                            <Box sx={{ flex: 1, minWidth: 0 ,padding: '0px',}}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {item.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  mt: 0,
                                  whiteSpace: 'wrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: 'black',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {item.submenu}
                              </Typography>
                            </Box>

                            {/* Quantity controls and price */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 0,
                              ml: 1
                            }}>
                              {/* Quantity controls */}
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}>
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    p: 0.5,
                                    color: 'text.secondary'
                                  }}
                                  onClick={() => {
                                    // const currentQty = cart.find(cartItem => cartItem.id === item.id)?.quantity || 0;
                                    if (item.quantity > 1) {
                                      updateCartItemQuantity(item.id, item.quantity - 1);
                                    } else {
                                      removeFromCart(item.id);
                                    }
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" sx={{ px: 1.5 }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  sx={{ 
                                    p: 0.5,
                                    color: 'text.secondary'
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              
                              {/* Price */}
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  minWidth: '60px',
                                  textAlign: 'right'
                                }}
                              >
                                ₹{item.price}
                              </Typography>
                              <IconButton 
                                  size="small" 
                                  onClick={() => removeFromCart(item.id)}
                                  sx={{ 
                                    p: 0.5,
                                    color: 'text.secondary'
                                  }}
                                >
                                  <RemoveShoppingCartTwoTone fontSize="small" />
                                </IconButton>
                            </Box>
                          </Box>
                        }
                        sx={{ my: 0 }}
                      />
                    </ListItem>
                    {index < cartItems.length - 1 && (
                      <Divider sx={{ mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>

              <Button 
                fullWidth
                variant="outlined"
                size="medium"
                onClick={toggleDrawer(false)}
                sx={{
                  mb: 3,
                  py: 1,
                  borderRadius: 1,
                  textTransform: 'none'
                }}
              >
                Add more items
              </Button>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Offers
              </Typography>

              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: 'white',
                  '&:hover': {
                    boxShadow: 1,
                    cursor: 'pointer'
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  <FontAwesomeIcon icon={faTicket} 
                  style={{color: "#63E6BE",
                  }} />   Apply Coupon
                </Typography>
                <FontAwesomeIcon 
                  icon={faGreaterThan} 
                  size="small"
                  style={{ 
                    fontSize: '10px',
                    color: 'text.secondary'
                  }} 
                />
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Bill details
              </Typography>

              <Table size="small" sx={{ mb: 3 }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', px: 0 }}>
                      <Typography variant="body2">Item total</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', px: 0, textAlign: 'right' }}>
                      <Typography variant="body2">
                        <Box component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                          ₹{totalOriginalPrice}
                        </Box>
                        ₹{itemTotal}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', px: 0 }}>
                      <Typography variant="body2">Delivery charges</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', px: 0, textAlign: 'right' }}>
                      <Typography variant="body2">₹{deliveryCharges}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', px: 0 }}>
                      <Typography variant="body2">Taxes</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', px: 0, textAlign: 'right' }}>
                      <Typography variant="body2">₹{taxes}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', px: 0 }}>
                      <Typography variant="body2">Seller Convenience Fee</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none', px: 0, textAlign: 'right' }}>
                      <Typography variant="body2">₹{convenienceFee}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total amount
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                Cancellation is not possible once the restaurant accepts your order
              </Typography>
              <Typography variant="body2" color="#00acee" sx={{ mb: 2 }}>
                Read cancellation policy
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Having trouble ordering?
              <Typography variant="body2" color="#00acee" sx={{ mb: 3 }}>
                Contact support
              </Typography>
                
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                At Nextorbitals.in, your trust is foremost. Your money is yours until you get what you paid for.
              </Typography>

              <Button 
                fullWidth
                variant="contained"
                size="large"
                onClick={() => setOrderOpen(true)}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 'bold',
                  backgroundColor: '#00acee'
                }}
              >
                Place Your Order ₹{grandTotal.toLocaleString('en-IN')}
              </Button>
              <OrderConfirmation 
                cartItems={cartItems}
                setCart={setCart}
                open={orderOpen}
                onClose={() => { clear_cart(); }}
                upiId={restaurantUPI}
                totalAmount={totalPrice}
              />
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default MobileCart;