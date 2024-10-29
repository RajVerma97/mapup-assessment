export interface WeatherChartData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  soilTemperature: number;
}

export interface CloudCoverData {
  month: string;
  avgLow: number;
  avgMid: number;
  avgHigh: number;
}
export interface MonthlyTemperatureData {
  month: string;
  year: string;
  avgTemp: number;
  monthName: string;
  formattedDate: string;
}
export interface MonthlyHumidityData {
  month: string;
  year: string;
  avgHumidity: number;
  monthName: string;
  formattedDate: string;
}

export interface WindSpeedDirectionData {
  wind_speed_100m: number;
  wind_direction_100m: number;
}
export interface WeatherSeasonData {
  season: string;
  year: number;
  avgTemp: number;
  avgDewPoint: number;
  avgPrecipitation: number;
  avgRain: number;
  avgSnowfall: number;
  avgWindSpeed: number;
  avgCloudCoverLow: number;
  avgCloudCoverMid: number;
  avgCloudCoverHigh: number;
  avgSoilTemp: number;
  avgSoilMoisture: number;
  formattedPeriod: string;
}

export interface DailyWeatherData {
  date: string;
  avgRain: number;
  avgPrecipitation: number;
  avgSnowfall: number;
}

export interface FileUploadAuthResponse {
  message: string;
}

export interface WindSpeedDirectionData {
  wind_direction_100m: number;
  wind_speed_100m: number;
}
