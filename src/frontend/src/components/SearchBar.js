import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Divider, 
  Box,
  Typography,
  Autocomplete,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchMajorCities } from '../services/weatherService';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load major cities when component mounts
  React.useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      try {
        const citiesData = await fetchMajorCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCities();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please try searching by city name.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please try searching by city name.');
    }
  };

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
      elevation={3}
      onSubmit={handleSubmit}
    >
      <Autocomplete
        freeSolo
        options={cities.map(city => city.name)}
        loading={loading}
        sx={{ ml: 1, flex: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for a city..."
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
          />
        )}
        value={searchTerm}
        onChange={(event, newValue) => {
          setSearchTerm(newValue);
          if (newValue) {
            onSearch(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton 
        color="primary" 
        sx={{ p: '10px' }} 
        aria-label="use current location"
        onClick={handleLocationClick}
      >
        <LocationOnIcon />
      </IconButton>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2, ml: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Use location
        </Typography>
      </Box>
    </Paper>
  );
};

export default SearchBar;
