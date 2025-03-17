import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Grid, 
  Divider,
  Chip
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherUtils';

const CurrentWeather = ({ data }) => {
  if (!data || !data.current) {
    return null;
  }

  const { current, current_units, location, city } = data;
  
  // Format the current time
  const currentTime = new Date(current.time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {city ? city.name + ', ' + city.country : 'Current Location'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentTime} • {location.timezone}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2 }}>
              {React.createElement(getWeatherIcon(current.weather_code, current.is_day), { 
                className: 'large-weather-icon',
                fontSize: 'large'
              })}
            </Box>
            <Box>
              <Typography variant="h2" component="p">
                {Math.round(current.temperature_2m)}
                {current_units.temperature_2m}
              </Typography>
              <Typography variant="body1">
                {getWeatherDescription(current.weather_code)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Feels like {Math.round(current.apparent_temperature)}
                {current_units.apparent_temperature}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <OpacityIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Humidity: {current.relative_humidity_2m}{current_units.relative_humidity_2m}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AirIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Wind: {Math.round(current.wind_speed_10m)} {current_units.wind_speed_10m}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CompressIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Pressure: {current.surface_pressure} {current_units.surface_pressure}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {current.is_day ? (
                    <WbSunnyIcon sx={{ mr: 1, color: 'warning.main' }} />
                  ) : (
                    <NightsStayIcon sx={{ mr: 1, color: 'info.main' }} />
                  )}
                  <Typography variant="body2">
                    {current.is_day ? 'Day time' : 'Night time'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {current.precipitation > 0 && (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<OpacityIcon />} 
                  label={`Precipitation: ${current.precipitation} ${current_units.precipitation}`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="body2" color="text.secondary">
          Elevation: {location.elevation}m • Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CurrentWeather;
