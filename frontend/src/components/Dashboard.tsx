import { BarChart2, Droplet, Thermometer, Upload, Wind } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import MonthlyAverageTemperatureChart from "./MonthlyTemperatureChart";
import AvgHumidityChart from "./AvgHumidityChart";
import { motion } from "framer-motion";
import useFileUploadMutation from "@/app/hooks/use-file-upload";
import { notify, ToastManager } from "./ToastManager";
import { WeatherData, WeatherDataList } from "@/types/weather-data";
import dayjs from "dayjs";

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

import { socket } from "@/socket-io";

import dynamic from "next/dynamic";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";

const WeatherChart = dynamic(() => import("./WeatherChart"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const CloudCoverWeatherChart = dynamic(
  () => import("./CloudCoverWeatherChart"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
const WindSpeedDirectionChart = dynamic(
  () => import("./WindSpeedDirectionChart"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const WeatherSeasonChart = dynamic(() => import("./WeatherSeasonChart"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const DailyWeatherChart = dynamic(() => import("./WeatherDataPieChart"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  color = "#000",
}: MetricCardProps) => (
  <motion.div
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.1 }}
    className="bg-white rounded-xl p-6 shadow-lg"
  >
    <div className="flex items-center gap-4">
      <div
        className="p-3 rounded-lg bg-opacity-10"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </motion.div>
);

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

export default function Dashboard() {
  const fileUploadMutation = useFileUploadMutation({
    onSuccess: (data: FileUploadAuthResponse) => {
      notify({
        message: data?.message || "File uploaded successfully",
        status: "success",
      });

      // socket.emit("updatedData", (updatedData) => {
      //   console.log("updatedData", updatedData);
      // });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error?.response?.data?.message;
      notify({
        message: errorMessage || "Something went wrong",
        status: "error",
      });
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fileUploadMutation.mutate(formData);
    }
  };

  const [weatherData, setWeatherData] = useState<WeatherDataList>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [cloudCoverData, setCloudCoverData] = useState<CloudCoverData[]>([]);
  const [monthlyTemperatureData, setMonthlyTemperatureData] = useState<
    MonthlyTemperatureData[]
  >([]);
  const [monthlyHumidityData, setMonthlyHumidityData] = useState<
    MonthlyHumidityData[]
  >([]);
  const [weatherSeasonData, setWeatherSeasonData] = useState<
    WeatherSeasonData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (socket) {
        try {
          socket?.emit("fetchData", { page, limit, filter, sort });
          socket?.emit("fetchCloudCoverData");
          socket?.emit("fetchMonthlyTemperatureData");
          socket?.emit("fetchMonthlyHumidityData");
          socket?.emit("fetchWeatherSeasonChartData");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    socket.on("data", (data: WeatherDataList) => {
      setWeatherData(data);
    });

    socket.on("cloudCoverData", (data: CloudCoverData[]) => {
      setCloudCoverData(data);
    });

    socket.on("disconnect", () => {});
    socket.on("monthlyTemperatureData", (data: MonthlyTemperatureData[]) => {
      setMonthlyTemperatureData(data);
    });
    socket.on("monthlyHumidityData", (data: MonthlyHumidityData[]) => {
      setMonthlyHumidityData(data);
    });
    socket.on("weatherSeasonChartData", (data: WeatherSeasonData[]) => {
      setWeatherSeasonData(data);
    });

    fetchData();

    return () => {
      socket.off("data");
      socket.off("cloudCoverData");
      socket.off("disconnect");
      socket.off("monthlyTemperatureData");
      socket.off("monthlyHumidityData");
      socket.off("weatherSeasonChartData");
    };
  }, [page, limit, filter, sort]);

  const weatherChartData: WeatherChartData[] = weatherData?.map(
    (item: WeatherData) => ({
      time: dayjs(item?.time).format("DD/MM/YYYY"),
      temperature: parseFloat(item?.temperature_2m),
      humidity: parseFloat(item?.dew_point_2m),
      windSpeed: parseFloat(item?.wind_speed_100m),
      soilTemperature: parseFloat(item?.soil_temperature_7_to_28cm),
    })
  );

  const windSpeedData: WindSpeedDirectionData[] = weatherData?.map(
    (item: WeatherData) => ({
      wind_speed_100m: parseFloat(item.wind_speed_100m),
      wind_direction_100m: parseFloat(item.wind_direction_100m),
    })
  );

  const dailyWeatherData: DailyWeatherData[] = useMemo(() => {
    return weatherSeasonData?.map((item: WeatherSeasonData) => ({
      date: item?.formattedPeriod || "",
      avgRain: item?.avgRain || 0,
      avgPrecipitation: item?.avgPrecipitation || 0,
      avgSnowfall: item?.avgSnowfall || 0,
    }));
  }, [weatherSeasonData]);

  return (
    <div className=" bg-gradient-to-r from-purple-400 to-indigo-400 text-black p-8 space-y-4">
      <div className="bg-white rounded-xl p-8 shadow-lg flex  justify-between items-center">
        <h1 className="text-3xl "> Dashboard</h1>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-6 py-4 bg-green-500  text-white rounded-lg hover:bg-green-700 cursor-pointer">
            <Upload size={30} color="white" />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Temperature"
          value={`${Math.round(Number(weatherData[0]?.temperature_2m))}°C`}
          icon={<Thermometer size={24} color="black" />}
          color="#FF5733"
        />
        <MetricCard
          title="Pressure"
          value={`${Math.round(Number(weatherData[0]?.pressure_msl))}hPa`}
          icon={<BarChart2 size={24} color="black" />}
          color="#1D8348"
        />
        <MetricCard
          title="Humidity"
          value={`${Math.round(Number(weatherData[0]?.dew_point_2m))}%`}
          icon={<Droplet size={24} color="black" />}
          color="#2980B9"
        />
        <MetricCard
          title="Wind Speed"
          value={`${Math.round(Number(weatherData[0]?.wind_speed_100m))}  m/s`}
          icon={<Wind size={24} color="black" />}
          color="#8E44AD"
        />
      </div>
      <div className="bg-white p-12 rounded-xl shadow-lg text-center">
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Upload Your Weather Data
        </h3>
        <p className="text-gray-600">
          Upload a CSV file with date, temperature, pressure, humidity, and wind
          speed columns
        </p>
      </div>

      <div className=" w-full   bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        <WeatherChart data={weatherChartData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        <CloudCoverWeatherChart data={cloudCoverData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-between items-center gap-4 text-center overflow-hidden  ">
        <MonthlyAverageTemperatureChart data={monthlyTemperatureData} />
        <AvgHumidityChart data={monthlyHumidityData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-between items-center gap-4 text-center overflow-hidden  ">
        <WindSpeedDirectionChart data={windSpeedData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-between items-center gap-4 text-center overflow-hidden  ">
        <WeatherSeasonChart data={weatherSeasonData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12  flex justify-between items-center gap-4 text-center overflow-hidden  ">
        <DailyWeatherChart data={dailyWeatherData} />
      </div>

      <ToastManager />
    </div>
  );
}
