import fetchWeatherData from "@/queries/fetch-weather-data";
import useAuthenticatedQuery from "./use-authenticated-query";

export interface WeatherDataParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
}

export default function useFetchWeatherData(params: WeatherDataParams) {
  return useAuthenticatedQuery(["weather-data", params], ({ queryKey }) => {
    const [, queryParams] = queryKey as [string, WeatherDataParams];
    return fetchWeatherData(queryParams);
  });
}
