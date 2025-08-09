import React from 'react';
import { Box, Typography, List, ListItem, Divider } from '@mui/material';

const OrderHistory = () => {
  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Order History</Typography>
      <List>
        {orders.map(order => (
          <React.Fragment key={order.id}>
            <ListItem>
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
    </Box>
  );
};

export default OrderHistory;