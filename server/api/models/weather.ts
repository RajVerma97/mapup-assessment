const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true },
  utc_offset_seconds: { type: Number, required: true },
  timezone: { type: String, required: true },
  timezone_abbreviation: { type: String, required: true },
  generationtime_ms: { type: Number },
  hourly_units: {
    time: String,
    temperature_2m: String,
  },
  hourly: {
    time: [{ type: String }],
    temperature_2m: [{ type: Number }],
  },
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
