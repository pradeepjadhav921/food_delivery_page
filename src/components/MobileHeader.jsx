// src/components/MobileHeader.jsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MobileHeader = ({ name, address, onBack, hotel_in_url }) => {
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
    setSelectedOrder(null);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  return (
    <>
      <AppBar 
        position="fixed" 
        color="inherit" 
        elevation={1}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ px: 1, padding: 0, alignSelf: 'anchor-center' }}>
          {/* Conditional rendering for back button or logo */}
          {hotel_in_url ? (
           <IconButton edge="start" color="inherit" aria-label="logo">
              <img 
                src="/food-truck.png" 
                alt="Food Truck" 
                style={{ 
                  width: 28, 
                  height: 25, 
                  padding: 0,
                  objectFit: 'contain'
                }} 
              />
            </IconButton>
          ) : (
             <IconButton 
              size='small'
              edge="start" 
              color="inherit" 
              aria-label="back"
              onClick={handleBackClick}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box sx={{ ml: 1, overflow: 'hidden', flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {name || 'Restaurant Name'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block'
              }}
            >
              {address || 'Restaurant Address'}
            </Typography>
          </Box>

          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="history"
            onClick={handleOpenHistory}
          >
            <img 
              src="/history-book.png" 
              alt="Order History" 
              style={{ 
                width: 25, 
                height: 30, 
                padding: 0,
                objectFit: 'contain'
              }} 
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Order History Dialog */}
      <Dialog
        open={openHistory}
        onClose={handleCloseHistory}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedOrder ? 'Order Items' : 'Order History'}
          <IconButton
            aria-label="close"
            onClick={selectedOrder ? () => setSelectedOrder(null) : handleCloseHistory}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Order #{selectedOrder.id} - {new Date(selectedOrder.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: ₹{selectedOrder.totalAmount} ({selectedOrder.items.length} items)
                </Typography>
              </Box>
                <List>
                <span style={{ marginRight: 0, whiteSpace: 'nowrap' }}>{"name     (price x qty)     amount"}</span>
                <Divider />
                {selectedOrder.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 1 }}>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 10 }}>{index + 1}.</span>
                        <span style={{ marginRight: 10 }}>{item.submenu}</span>
                        <span style={{ marginRight: 10 }}>{item.price}x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </Typography>
                    </ListItem>
                    {index < selectedOrder.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : orders.length === 0 ? (
            <Typography variant="body1" color="textSecondary" sx={{ py: 2 }}>
              No order history found
            </Typography>
          ) : (
            <List>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <ListItem 
                    button 
                    onClick={() => handleOrderClick(order)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle1">
                        Order #{order.id} - {new Date(order.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Total: ₹{order.totalAmount} ({order.items.length} items)
                      </Typography>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileHeader;