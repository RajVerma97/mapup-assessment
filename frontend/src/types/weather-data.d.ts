export interface WeatherData {
  _id: string;
  time: string;
  temperature_2m: string;
  dew_point_2m: string;
  precipitation: string;
  rain: string;
  snowfall: string;
  snow_depth: string;
  weather_code: string;
  pressure_msl: string;
  surface_pressure: string;
  cloud_cover_low: string;
  cloud_cover_mid: string;
  cloud_cover_high: string;
  wind_speed_100m: string;
  wind_direction_100m: string;
  soil_temperature_7_to_28cm: string;
  soil_moisture_7_to_28cm: string;
}

export type WeatherDataList = WeatherData[];
