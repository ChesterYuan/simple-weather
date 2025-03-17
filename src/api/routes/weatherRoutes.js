const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

// Get current weather by coordinates
router.get('/current', weatherController.getCurrentWeather);

// Get forecast by coordinates
router.get('/forecast', weatherController.getForecast);

// Get weather for a specific city
router.get('/city', weatherController.getWeatherByCity);

// Get list of major cities
router.get('/cities', weatherController.getMajorCities);

module.exports = router;
