import React, { useState, useEffect } from 'react';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Box,
  Typography,
  Paper
} from '@mui/material';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import MajorCities from './components/MajorCities';
import RecentSearches from './components/RecentSearches';
import { fetchWeatherByCity, fetchWeatherByCoordinates } from './services/weatherService';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      // Check if the search term is a city name or coordinates
      if (typeof searchTerm === 'string') {
        data = await fetchWeatherByCity(searchTerm);
        
        // Add to recent searches
        updateRecentSearches({
          type: 'city',
          name: searchTerm,
          timestamp: new Date().toISOString()
        });
      } else {
        // Assume it's coordinates
        const { latitude, longitude } = searchTerm;
        data = await fetchWeatherByCoordinates(latitude, longitude);
        
        // Add to recent searches
        updateRecentSearches({
          type: 'coordinates',
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        });
      }
      
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateRecentSearches = (newSearch) => {
    setRecentSearches(prevSearches => {
      // Check if this search already exists
      const existingIndex = prevSearches.findIndex(search => {
        if (search.type === newSearch.type) {
          if (search.type === 'city') {
            return search.name.toLowerCase() === newSearch.name.toLowerCase();
          } else {
            return search.latitude === newSearch.latitude && 
                   search.longitude === newSearch.longitude;
          }
        }
        return false;
      });
      
      // If it exists, remove it
      let updatedSearches = [...prevSearches];
      if (existingIndex !== -1) {
        updatedSearches.splice(existingIndex, 1);
      }
      
      // Add the new search to the beginning
      updatedSearches = [newSearch, ...updatedSearches];
      
      // Keep only the last 5 searches
      if (updatedSearches.length > 5) {
        updatedSearches = updatedSearches.slice(0, 5);
      }
      
      return updatedSearches;
    });
  };

  const handleRecentSearchClick = (search) => {
    if (search.type === 'city') {
      handleSearch(search.name);
    } else {
      handleSearch({
        latitude: search.latitude,
        longitude: search.longitude
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Simple Weather App
          </Typography>
          
          <SearchBar onSearch={handleSearch} />
          
          {recentSearches.length > 0 && (
            <Box sx={{ mt: 2, mb: 4 }}>
              <RecentSearches 
                searches={recentSearches} 
                onSearchClick={handleRecentSearchClick} 
              />
            </Box>
          )}
          
          {error && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                mt: 2, 
                bgcolor: 'error.light', 
                color: 'error.contrastText' 
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>Loading weather data...</Typography>
            </Box>
          ) : weatherData ? (
            <Box sx={{ mt: 4 }}>
              <CurrentWeather data={weatherData} />
              <Box sx={{ mt: 4 }}>
                <DailyForecast data={weatherData.daily} units={weatherData.daily_units} />
              </Box>
              <Box sx={{ mt: 4 }}>
                <HourlyForecast data={weatherData.hourly} units={weatherData.hourly_units} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 4 }}>
              <MajorCities onCitySelect={handleSearch} />
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
