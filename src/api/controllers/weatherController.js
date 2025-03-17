const weatherService = require('../services/weatherService');
const NodeCache = require('node-cache');

// Cache for storing recent search results (TTL: 10 minutes)
const weatherCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
const searchHistoryCache = new NodeCache({ stdTTL: 0 }); // No expiration for search history

// Keep track of the last 5 searches per user (simplified, using IP as user identifier)
const MAX_HISTORY_ITEMS = 5;

const getCurrentWeather = async (req, res) => {
  try {
    const { latitude, longitude, ip = 'default' } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `current_${latitude}_${longitude}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      // Update search history
      updateSearchHistory(ip, { latitude, longitude, type: 'coordinates' });
      return res.json(cachedData);
    }

    const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
    
    // Cache the result
    weatherCache.set(cacheKey, weatherData);
    
    // Update search history
    updateSearchHistory(ip, { latitude, longitude, type: 'coordinates' });
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({ error: 'Failed to fetch current weather data' });
  }
};

const getForecast = async (req, res) => {
  try {
    const { latitude, longitude, days = 7, ip = 'default' } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `forecast_${latitude}_${longitude}_${days}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      // Update search history
      updateSearchHistory(ip, { latitude, longitude, type: 'coordinates' });
      return res.json(cachedData);
    }

    const forecastData = await weatherService.getForecast(latitude, longitude, days);
    
    // Cache the result
    weatherCache.set(cacheKey, forecastData);
    
    // Update search history
    updateSearchHistory(ip, { latitude, longitude, type: 'coordinates' });
    
    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};

const getWeatherByCity = async (req, res) => {
  try {
    const { city, ip = 'default' } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const cacheKey = `city_${city}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      // Update search history
      updateSearchHistory(ip, { city, type: 'city' });
      return res.json(cachedData);
    }

    const cityData = await weatherService.getWeatherByCity(city);
    
    // Cache the result
    weatherCache.set(cacheKey, cityData);
    
    // Update search history
    updateSearchHistory(ip, { city, type: 'city' });
    
    res.json(cityData);
  } catch (error) {
    console.error('Error fetching city weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data for this city' });
  }
};

const getMajorCities = async (req, res) => {
  try {
    const cachedData = weatherCache.get('major_cities');
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const citiesData = await weatherService.getMajorCities();
    
    // Cache the result
    weatherCache.set('major_cities', citiesData);
    
    res.json(citiesData);
  } catch (error) {
    console.error('Error fetching major cities:', error);
    res.status(500).json({ error: 'Failed to fetch major cities data' });
  }
};

// Get search history for a user
const getSearchHistory = (req, res) => {
  const { ip = 'default' } = req.query;
  const history = searchHistoryCache.get(ip) || [];
  res.json(history);
};

// Helper function to update search history
const updateSearchHistory = (ip, searchData) => {
  let history = searchHistoryCache.get(ip) || [];
  
  // Check if this search already exists in history
  const existingIndex = history.findIndex(item => {
    if (item.type === searchData.type) {
      if (item.type === 'coordinates') {
        return item.latitude === searchData.latitude && item.longitude === searchData.longitude;
      } else {
        return item.city === searchData.city;
      }
    }
    return false;
  });
  
  // If exists, remove it to add to the front
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  // Add new search to the front
  history.unshift({
    ...searchData,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last MAX_HISTORY_ITEMS
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }
  
  // Update cache
  searchHistoryCache.set(ip, history);
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getWeatherByCity,
  getMajorCities,
  getSearchHistory
};
