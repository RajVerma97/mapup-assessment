import {
  BarChart2,
  Droplet,
  Pause,
  Thermometer,
  Upload,
  Wind,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import MonthlyAverageTemperatureChart from "./MonthlyTemperatureChart";
import AvgHumidityChart from "./AvgHumidityChart";
import useFileUploadMutation from "@/app/hooks/use-file-upload";
import { notify, ToastManager } from "./ToastManager";
import { WeatherData, WeatherDataList } from "@/types/weather-data";
import dayjs from "dayjs";
import { socket } from "@/socket-io";

import dynamic from "next/dynamic";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";
import {
  CloudCoverData,
  DailyWeatherData,
  FileUploadAuthResponse,
  MonthlyHumidityData,
  MonthlyTemperatureData,
  WeatherChartData,
  WeatherSeasonData,
  WindSpeedDirectionData,
} from "@/types/dashboard";
import { TimeFrame } from "@/enums/dashboard";
import MetricCard from "./MetricCard";
import Loading from "./Loading";
import SpinnerManager from "./SpinnerManager";

const WeatherChart = dynamic(() => import("./WeatherChart"), {
  ssr: false,
  loading: () => <Loading isLoading={true} />,
});

const CloudCoverWeatherChart = dynamic(
  () => import("./CloudCoverWeatherChart"),
  {
    ssr: false,
    loading: () => <Loading isLoading={true} />,
  }
);
const WindSpeedDirectionChart = dynamic(
  () => import("./WindSpeedDirectionChart"),
  {
    ssr: false,
    loading: () => <Loading isLoading={true} />,
  }
);

const WeatherSeasonChart = dynamic(() => import("./WeatherSeasonChart"), {
  ssr: false,
  loading: () => <Loading isLoading={true} />,
});

const DailyWeatherChart = dynamic(() => import("./WeatherDataPieChart"), {
  ssr: false,
  loading: () => <Loading isLoading={true} />,
});

interface ProgressResponse {
  jobId: string;
  progress: string;
}

export default function Dashboard() {
  const fileUploadMutation = useFileUploadMutation({
    onSuccess: (data: FileUploadAuthResponse) => {
      notify({
        message: data?.message || "File uploaded successfully",
        status: "success",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error?.response?.data?.message;
      notify({
        message: errorMessage || "Something went wrong",
        status: "error",
      });
      setIsUploading(false);
      setUploadingProgress(0);
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadingProgress(0);
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fileUploadMutation.mutate(formData);
    }
  };

  const [page] = useState(1);
  const [limit] = useState(500);
  const [filter] = useState("");
  const [sort] = useState("asc");

  const [weatherData, setWeatherData] = useState<WeatherDataList>([]);
  const [isWeatherDataLoading, setIsWeatherDataLoading] =
    useState<boolean>(false);
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

  const [timeFrame] = useState<TimeFrame>(TimeFrame.YEARLY);

  const [dateFrom, setDateFrom] = useState("2022-01-01");
  const [dateTo, setDateTo] = useState("2022-01-09");

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingProgress, setUploadingProgress] = useState<number>(4);

  useEffect(() => {
    if (uploadingProgress === 100) {
      setIsUploading(false);
    }
  }, [uploadingProgress]);

  useEffect(() => {
    const fetchData = async () => {
      setIsWeatherDataLoading(true);
      if (socket) {
        try {
          socket?.emit("fetchData", {
            page,
            limit,
            filter,
            sort,
            timeFrame,
            dateFrom,
            dateTo,
          });
          socket?.emit("fetchCloudCoverData");
          socket?.emit("fetchMonthlyTemperatureData");
          socket?.emit("fetchMonthlyHumidityData");
          socket?.emit("fetchWeatherSeasonChartData");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    socket.on("data", (response) => {
      setWeatherData(response.data);
      setIsWeatherDataLoading(false);
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
    socket.on("job:completed", () => {
      console.log("job compleleted");
    });
    socket.on("progress", (data: ProgressResponse) => {
      console.log(data.progress);
      setUploadingProgress(parseInt(data.progress));
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
  }, [
    page,
    limit,
    dateFrom,
    dateTo,
    timeFrame,
    isUploading,
    filter,
    sort,
    uploadingProgress,
  ]);

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

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadingProgress(0);
  };

  return (
    <div className=" bg-gradient-to-r from-purple-400 to-indigo-400 text-black p-8 space-y-4">
      <div className="bg-white rounded-xl p-8 shadow-lg flex  justify-between items-center">
        <h1 className="text-3xl "> Dashboard</h1>

        <label className="flex items-center gap-2 px-6 py-4 bg-blue-500  text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          {isUploading ? (
            <div className="w-20 flex flex-col justify-between items-center">
              <SpinnerManager isLoading={true} />
              <p className="text-center text-md text-white">
                {uploadingProgress}%
              </p>
            </div>
          ) : (
            <div className="w-32 flex  justify-between items-center">
              <Upload size={30} color="white" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          )}
        </label>
        {isUploading && (
          <button
            className="flex items-center justify-center p-2 border-2 text-black rounded-md hover:scale-105  transition duration-200 ease-in-out"
            onClick={handleCancelUpload}
          >
            <Pause size={40} className="mr-2" />
          </button>
        )}
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
      <div className="bg-white p-12 rounded-xl shadow-lg ">
        <h1 className="text-3xl "> Filters</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      </div>

      <div className=" w-full   bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        {isWeatherDataLoading ? (
          <Loading isLoading={isWeatherDataLoading} />
        ) : (
          <WeatherChart data={weatherChartData} />
        )}
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
