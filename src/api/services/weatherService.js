const axios = require('axios');

// Base URL for the Open-Meteo API
const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1';

// List of major cities with their coordinates
const MAJOR_CITIES = [
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Houston', country: 'USA', latitude: 29.7604, longitude: -95.3698 },
  { name: 'Phoenix', country: 'USA', latitude: 33.4484, longitude: -112.0740 },
  { name: 'Philadelphia', country: 'USA', latitude: 39.9526, longitude: -75.1652 },
  { name: 'San Antonio', country: 'USA', latitude: 29.4241, longitude: -98.4936 },
  { name: 'San Diego', country: 'USA', latitude: 32.7157, longitude: -117.1611 },
  { name: 'Dallas', country: 'USA', latitude: 32.7767, longitude: -96.7970 },
  { name: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
  { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332 }
];

// Get current weather by coordinates
const getCurrentWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m'
      }
    });

    return {
      location: {
        latitude,
        longitude,
        timezone: response.data.timezone,
        timezone_abbreviation: response.data.timezone_abbreviation,
        elevation: response.data.elevation
      },
      current: response.data.current,
      current_units: response.data.current_units
    };
  } catch (error) {
    console.error('Error in getCurrentWeather service:', error);
    throw error;
  }
};

// Get forecast by coordinates
const getForecast = async (latitude, longitude, days = 7) => {
  try {
    const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        forecast_days: days,
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant'
      }
    });

    return {
      location: {
        latitude,
        longitude,
        timezone: response.data.timezone,
        timezone_abbreviation: response.data.timezone_abbreviation,
        elevation: response.data.elevation
      },
      hourly: response.data.hourly,
      hourly_units: response.data.hourly_units,
      daily: response.data.daily,
      daily_units: response.data.daily_units
    };
  } catch (error) {
    console.error('Error in getForecast service:', error);
    throw error;
  }
};

// Get weather by city name
const getWeatherByCity = async (cityName) => {
  try {
    // Find the city in our predefined list
    const city = MAJOR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    
    if (!city) {
      throw new Error('City not found');
    }
    
    // Get both current weather and forecast
    const [currentWeather, forecast] = await Promise.all([
      getCurrentWeather(city.latitude, city.longitude),
      getForecast(city.latitude, city.longitude)
    ]);
    
    return {
      city: {
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude
      },
      current: currentWeather.current,
      current_units: currentWeather.current_units,
      hourly: forecast.hourly,
      hourly_units: forecast.hourly_units,
      daily: forecast.daily,
      daily_units: forecast.daily_units
    };
  } catch (error) {
    console.error('Error in getWeatherByCity service:', error);
    throw error;
  }
};

// Get list of major cities
const getMajorCities = async () => {
  try {
    // Return the predefined list of major cities
    return MAJOR_CITIES;
  } catch (error) {
    console.error('Error in getMajorCities service:', error);
    throw error;
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getWeatherByCity,
  getMajorCities
};
