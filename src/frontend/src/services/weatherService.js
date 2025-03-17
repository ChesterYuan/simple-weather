import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = '/api/weather';

// Fetch current weather by coordinates
export const fetchWeatherByCoordinates = async (latitude, longitude) => {
  try {
    // Get both current weather and forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/current`, {
        params: { latitude, longitude }
      }),
      axios.get(`${API_BASE_URL}/forecast`, {
        params: { latitude, longitude }
      })
    ]);

    // Combine the data
    return {
      ...currentResponse.data,
      hourly: forecastResponse.data.hourly,
      hourly_units: forecastResponse.data.hourly_units,
      daily: forecastResponse.data.daily,
      daily_units: forecastResponse.data.daily_units
    };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

// Fetch weather by city name
export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/city`, {
      params: { city }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

// Fetch list of major cities
export const fetchMajorCities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching major cities:', error);
    throw error;
  }
};

// Fetch recent searches
export const fetchRecentSearches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
};
