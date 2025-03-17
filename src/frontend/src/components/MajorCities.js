import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Skeleton,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchMajorCities } from '../services/weatherService';

const MajorCities = ({ onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await fetchMajorCities();
        setCities(citiesData);
      } catch (err) {
        console.error('Error loading major cities:', err);
        setError('Failed to load major cities');
      } finally {
        setLoading(false);
      }
    };
    
    loadCities();
  }, []);

  const handleCityClick = (city) => {
    onCitySelect(city.name);
  };

  // Group cities by continent/region
  const groupedCities = cities.reduce((acc, city) => {
    // Simple grouping by country for now
    const country = city.country;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(city);
    return acc;
  }, {});

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Major Cities
        </Typography>
        <Grid container spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Major Cities
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Major Cities
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Select a city to view its current weather and forecast
      </Typography>
      
      {Object.entries(groupedCities).map(([country, countryCities]) => (
        <Box key={country} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {country}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {countryCities.map((city) => (
              <Grid item xs={12} sm={6} md={3} key={city.name}>
                <Card 
                  className="weather-card"
                  sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    boxShadow: 1
                  }}
                >
                  <CardActionArea 
                    sx={{ height: '100%' }}
                    onClick={() => handleCityClick(city)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div">
                          {city.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default MajorCities;
