import { WeatherDataParams } from "@/app/hooks/use-fetch-weather-data";
import axiosInstance from "@/lib/axiosInstance";

export default async function fetchWeatherData(params: WeatherDataParams = {}) {
  const { page = 1, limit = 5, filter = "", sort = "desc" } = params;

  const response = await axiosInstance.get(`/data`, {
    params: { page, limit, filter, sort },
  });
  return response.data.data;
}
