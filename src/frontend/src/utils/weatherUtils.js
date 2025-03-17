import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterIcon from '@mui/icons-material/Water';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import FogIcon from '@mui/icons-material/Cloud';

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
export const getWeatherIcon = (code, isDay = 1) => {
  // Default to day icons unless explicitly night
  const isDaytime = isDay === 1;
  
  // Clear sky
  if (code === 0) {
    return isDaytime ? WbSunnyIcon : NightsStayIcon;
  }
  
  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    return FilterDramaIcon;
  }
  
  // Overcast
  if (code === 3) {
    return CloudIcon;
  }
  
  // Fog
  if (code === 45 || code === 48) {
    return FogIcon;
  }
  
  // Drizzle
  if (code >= 51 && code <= 57) {
    return WaterIcon;
  }
  
  // Rain
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return WaterIcon;
  }
  
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return AcUnitIcon;
  }
  
  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return ThunderstormIcon;
  }
  
  // Default
  return GrainIcon;
};

export const getWeatherDescription = (code) => {
  // Clear sky
  if (code === 0) {
    return 'Clear sky';
  }
  
  // Mainly clear, partly cloudy, and overcast
  if (code === 1) {
    return 'Mainly clear';
  }
  if (code === 2) {
    return 'Partly cloudy';
  }
  if (code === 3) {
    return 'Overcast';
  }
  
  // Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return 'Fog';
  }
  
  // Drizzle: Light, moderate, and dense intensity
  if (code === 51) {
    return 'Light drizzle';
  }
  if (code === 53) {
    return 'Moderate drizzle';
  }
  if (code === 55) {
    return 'Dense drizzle';
  }
  
  // Freezing Drizzle: Light and dense intensity
  if (code === 56) {
    return 'Light freezing drizzle';
  }
  if (code === 57) {
    return 'Dense freezing drizzle';
  }
  
  // Rain: Slight, moderate and heavy intensity
  if (code === 61) {
    return 'Slight rain';
  }
  if (code === 63) {
    return 'Moderate rain';
  }
  if (code === 65) {
    return 'Heavy rain';
  }
  
  // Freezing Rain: Light and heavy intensity
  if (code === 66) {
    return 'Light freezing rain';
  }
  if (code === 67) {
    return 'Heavy freezing rain';
  }
  
  // Snow fall: Slight, moderate, and heavy intensity
  if (code === 71) {
    return 'Slight snow fall';
  }
  if (code === 73) {
    return 'Moderate snow fall';
  }
  if (code === 75) {
    return 'Heavy snow fall';
  }
  
  // Snow grains
  if (code === 77) {
    return 'Snow grains';
  }
  
  // Rain showers: Slight, moderate, and violent
  if (code === 80) {
    return 'Slight rain showers';
  }
  if (code === 81) {
    return 'Moderate rain showers';
  }
  if (code === 82) {
    return 'Violent rain showers';
  }
  
  // Snow showers slight and heavy
  if (code === 85) {
    return 'Slight snow showers';
  }
  if (code === 86) {
    return 'Heavy snow showers';
  }
  
  // Thunderstorm: Slight or moderate
  if (code === 95) {
    return 'Thunderstorm';
  }
  
  // Thunderstorm with slight and heavy hail
  if (code === 96 || code === 99) {
    return 'Thunderstorm with hail';
  }
  
  // Default
  return 'Unknown';
};
