import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherUtils';

const DailyForecast = ({ data, units }) => {
  if (!data || !data.time) {
    return null;
  }

  // Format date to display day of week
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        7-Day Forecast
      </Typography>
      
      <Grid container spacing={2}>
        {data.time.map((time, index) => (
          <Grid item xs={12} sm={6} md={3} key={time}>
            <Card 
              className="weather-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {index === 0 ? 'Today' : formatDate(time)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {React.createElement(getWeatherIcon(data.weather_code[index], 1), { 
                    className: 'weather-icon'
                  })}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {getWeatherDescription(data.weather_code[index])}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.primary">
                    High
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {Math.round(data.temperature_2m_max[index])}{units.temperature_2m_max}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.primary">
                    Low
                  </Typography>
                  <Typography variant="body1">
                    {Math.round(data.temperature_2m_min[index])}{units.temperature_2m_min}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Precip
                  </Typography>
                  <Typography variant="body2">
                    {data.precipitation_sum[index]}{units.precipitation_sum}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Wind
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(data.wind_speed_10m_max[index])}{units.wind_speed_10m_max}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default DailyForecast;
