const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  temperature_2m: {
    type: String,
    required: true,
  },
  dew_point_2m: {
    type: String,
    required: true,
  },
  precipitation: {
    type: String,
    required: true,
  },
  rain: {
    type: String,
    required: true,
  },
  snowfall: {
    type: String,
    required: true,
  },
  snow_depth: {
    type: String,
    required: true,
  },
  weather_code: {
    type: String,
    required: true,
  },
  pressure_msl: {
    type: String,
    required: true,
  },
  surface_pressure: {
    type: String,
    required: true,
  },
  cloud_cover_low: {
    type: String,
    required: true,
  },
  cloud_cover_mid: {
    type: String,
    required: true,
  },
  cloud_cover_high: {
    type: String,
    required: true,
  },
  wind_speed_100m: {
    type: String,
    required: true,
  },
  wind_direction_100m: {
    type: String,
    required: true,
  },
  soil_temperature_7_to_28cm: {
    type: String,
    required: true,
  },
  soil_moisture_7_to_28cm: {
    type: String,
    required: true,
  },
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
