// src/components/SearchFilter.jsx
import React from 'react';
import { 
  TextField, 
  Box, 
  Chip, 
  Stack, 
  InputAdornment, 
  Menu, 
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  restaurantName,
  isMobile,
  menuItems = [],
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (type, value) => {
    setFilter({ type, value });
    handleClose();
  };

   // First, filter menuItems to only include available items
  const availableMenuItems = menuItems.filter(item => item.available === 1);

  // Then get unique menus from available items only Get unique menus for filtering (changed from submenu to menu)
  const menus1 = [...new Set(availableMenuItems.map(item => item.menu))].sort((a, b) => 
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  return (
    <Box>
      {/* Search and Menu Filters in one row */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search in ${restaurantName}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }
          }}
          sx={{ flex: 1 }}
        />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          <Chip
            label="All"
            onClick={() => handleFilter('all', 'all')}
            color={filter.type === 'all' ? 'primary' : 'default'}
            variant={filter.type === 'all' ? 'filled' : 'outlined'}
            size="small"
            sx={{ mr: 1 }}
          />
          
          {menus1.map(menu => (
            <Chip
              key={menu}
              label={menu}
              onClick={() => handleFilter('menu', menu)}
              color={filter.type === 'menu' && filter.value === menu ? 'primary' : 'default'}
              variant={filter.type === 'menu' && filter.value === menu ? 'filled' : 'outlined'}
              size="small"
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      </Box>

      {/* Veg/Non-Veg Filters */}
      {isMobile ? (
        <Box sx={{ mt: 2 }}>
          <Chip
            icon={<FilterIcon fontSize="small" />}
            label="Dietary Filters"
            variant="outlined"
            size="small"
            onClick={handleClick}
            deleteIcon={<ExpandMoreIcon />}
            onDelete={handleClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: '200px',
              },
            }}
          >
            <MenuItem 
              onClick={() => handleFilter('veg', 'veg')}
              selected={filter.type === 'veg'}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: '1px solid #4CAF50',
                  mr: 1
                }} />
                Veg
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilter('non-veg', 'non-veg')}
              selected={filter.type === 'non-veg'}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#8B4513',
                  border: '1px solid #8B4513',
                  mr: 1
                }} />
                Non Veg
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            label="Veg"
            onClick={() => handleFilter('veg', 'veg')}
            color={filter.type === 'veg' ? 'primary' : 'default'}
            variant={filter.type === 'veg' ? 'filled' : 'outlined'}
            size="small"
            sx={{
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '""',
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: '#4CAF50',
                  borderRadius: '50%',
                  marginRight: 0.5,
                }
              }
            }}
          />
          <Chip
            label="Non Veg"
            onClick={() => handleFilter('non-veg', 'non-veg')}
            color={filter.type === 'non-veg' ? 'primary' : 'default'}
            variant={filter.type === 'non-veg' ? 'filled' : 'outlined'}
            size="small"
            sx={{
              '& .MuiChip-label': {
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '""',
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: '#8B4513',
                  borderRadius: '50%',
                  marginRight: 0.5,
                }
              }
            }}
          />
        </Stack>
      )}
    </Box>
  );
};

export default SearchFilter;