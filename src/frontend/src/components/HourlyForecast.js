import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getWeatherIcon } from '../utils/weatherUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HourlyForecast = ({ data, units }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  
  if (!data || !data.time) {
    return null;
  }

  // Group hourly data by day
  const days = [];
  const now = new Date();
  let currentDay = -1;
  
  data.time.forEach((time, index) => {
    const date = new Date(time);
    const dayOfMonth = date.getDate();
    
    if (currentDay !== dayOfMonth) {
      currentDay = dayOfMonth;
      days.push({
        date: date,
        startIndex: index
      });
    }
  });
  
  // Limit to 5 days for hourly forecast
  const limitedDays = days.slice(0, 5);
  
  const handleDayChange = (event, newValue) => {
    setSelectedDay(newValue);
  };
  
  // Format time to display hour
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for tab labels
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get data for the selected day
  const getSelectedDayData = () => {
    const startIndex = limitedDays[selectedDay].startIndex;
    const endIndex = selectedDay < limitedDays.length - 1 
      ? limitedDays[selectedDay + 1].startIndex 
      : data.time.length;
    
    return {
      times: data.time.slice(startIndex, endIndex),
      temperatures: data.temperature_2m.slice(startIndex, endIndex),
      weatherCodes: data.weather_code.slice(startIndex, endIndex),
      precipitationProbs: data.precipitation_probability.slice(startIndex, endIndex),
      windSpeeds: data.wind_speed_10m.slice(startIndex, endIndex)
    };
  };
  
  const selectedDayData = getSelectedDayData();
  
  // Prepare chart data
  const chartData = {
    labels: selectedDayData.times.map(time => formatTime(time)),
    datasets: [
      {
        label: `Temperature (${units.temperature_2m})`,
        data: selectedDayData.temperatures,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      },
      {
        label: `Precipitation Probability (${units.precipitation_probability})`,
        data: selectedDayData.precipitationProbs,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hourly Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Hourly Forecast
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={selectedDay} 
          onChange={handleDayChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          {limitedDays.map((day, index) => (
            <Tab 
              key={index} 
              label={index === 0 ? 'Today' : formatDate(day.date)} 
              id={`hourly-tab-${index}`}
              aria-controls={`hourly-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      
      <Box sx={{ height: 300, mb: 4 }}>
        <Line options={chartOptions} data={chartData} />
      </Box>
      
      <Grid container spacing={2}>
        {selectedDayData.times.map((time, index) => (
          <Grid item xs={6} sm={4} md={2} key={time}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatTime(time)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  {React.createElement(getWeatherIcon(selectedDayData.weatherCodes[index], 1), { 
                    className: 'weather-icon'
                  })}
                </Box>
                
                <Typography variant="h6" align="center">
                  {Math.round(selectedDayData.temperatures[index])}{units.temperature_2m}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rain
                  </Typography>
                  <Typography variant="body2">
                    {selectedDayData.precipitationProbs[index]}{units.precipitation_probability}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Wind
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(selectedDayData.windSpeeds[index])}{units.wind_speed_10m}
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

export default HourlyForecast;
