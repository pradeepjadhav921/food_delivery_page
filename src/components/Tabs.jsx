// src/components/Tabs.jsx
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const CustomTab = ({ label, active }) => {
  return (
    <Tab 
      label={label}
      sx={{
        textTransform: 'none',
        fontWeight: active ? 'bold' : 'normal',
        color: active ? 'primary.main' : 'text.primary',
        '&.Mui-selected': {
          color: 'primary.main',
        }
      }}
    />
  );
};

const RestaurantTabs = ({ activeTab }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab === 'about' ? 0 : 1} aria-label="restaurant tabs">
        <CustomTab label="About" active={activeTab === 'about'} />
        <CustomTab label="Order Online" active={activeTab === 'order'} />
      </Tabs>
    </Box>
  );
};

export default RestaurantTabs;