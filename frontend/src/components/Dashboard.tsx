import { BarChart2, Droplet, Thermometer, Upload, Wind } from "lucide-react";
import React, { useEffect, useState } from "react";
import MonthlyAverageTemperatureChart from "./MonthlyTemperatureChart";
import AvgHumidityChart from "./AvgHumidityChart";
import { motion } from "framer-motion";
import useFileUploadMutation from "@/app/hooks/use-file-upload";
import { ToastManager } from "./ToastManager";
// import { socket } from "@/socket-io";
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
import useFetchWeatherData from "@/app/hooks/use-fetch-weather-data";
import WeatherChart from "./WeatherChart";
import CloudCoverWeatherChart from "./CloudCoverWeatherChart";
import { socket } from "@/socket-io";

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

export default function Dashboard() {
  const fileUploadMutation = useFileUploadMutation();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fileUploadMutation.mutate(formData);
    }
  };

  // const { data } = useFetchWeatherData({
  //   page: 1,
  //   limit: 100,
  //   sort: "asc",
  //   filter: "",
  // });
  // console.log(data);

  // if (!data) {
  //   return <div>Loading...</div>;
  // }

  const [data, setData] = useState<WeatherDataList>([]);

  useEffect(() => {
    let previousData: WeatherDataList = [];

    const handleSocketData = (serverData: WeatherDataList) => {
      console.log("server");
      console.log(serverData);
      if (previousData.length > 0) {
      }
      setData(serverData);
      previousData = serverData;
    };

    socket.on("time", (data) => {
      handleSocketData(data);
    });

    return () => {
      socket.off("time", (data) => {
        handleSocketData(data);
      });
    };
  }, []);

  const WeatherChartData: WeatherChartData[] = data?.map(
    (item: WeatherData) => ({
      time: dayjs(item.time).format("DD/MM/YYYY"),
      temperature: parseFloat(item.temperature_2m),
      humidity: parseFloat(item.dew_point_2m),
      windSpeed: parseFloat(item.wind_speed_100m),
      soilTemperature: parseFloat(item.soil_temperature_7_to_28cm),
    })
  );

  const aggregateCloudCoverData = (data: WeatherData[]): CloudCoverData[] => {
    const monthDataMap: {
      [key: string]: { low: number[]; mid: number[]; high: number[] };
    } = {};

    data?.forEach((item: WeatherData) => {
      const month = dayjs(item.time).format("MMMM YYYY"); // Format the month as needed

      if (!monthDataMap[month]) {
        monthDataMap[month] = { low: [], mid: [], high: [] };
      }

      monthDataMap[month].low.push(Number(item.cloud_cover_low));
      monthDataMap[month].mid.push(Number(item.cloud_cover_mid));
      monthDataMap[month].high.push(Number(item.cloud_cover_high));
    });

    const cloudCoverData: CloudCoverData[] = Object.entries(monthDataMap).map(
      ([month, values]) => ({
        month,
        avgLow:
          values.low.length > 0
            ? Number(
                (
                  values.low.reduce((sum, value) => sum + value, 0) /
                  values.low.length
                ).toFixed(1)
              )
            : 0,
        avgMid:
          values.mid.length > 0
            ? Number(
                (
                  values.mid.reduce((sum, value) => sum + value, 0) /
                  values.mid.length
                ).toFixed(1)
              )
            : 0,
        avgHigh:
          values.high.length > 0
            ? Number(
                (
                  values.high.reduce((sum, value) => sum + value, 0) /
                  values.high.length
                ).toFixed(1)
              )
            : 0,
      })
    );

    return cloudCoverData;
  };
  const cloudCoverData = aggregateCloudCoverData(data);

  return (
    <div className=" bg-gradient-to-r from-purple-400 to-indigo-400 text-black p-8 space-y-4">
      <div className="bg-white rounded-xl p-8 shadow-lg flex  justify-between items-center">
        <h1 className="text-3xl "> Dashboard</h1>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-indigo-700 cursor-pointer">
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
          value="10°C"
          icon={<Thermometer size={24} color="black" />}
          color="#FF5733"
        />
        <MetricCard
          title="Pressure"
          value="1013 hPa"
          icon={<BarChart2 size={24} color="black" />}
          color="#1D8348"
        />
        <MetricCard
          title="Humidity"
          value="80%"
          icon={<Droplet size={24} color="black" />}
          color="#2980B9"
        />
        <MetricCard
          title="Wind Speed"
          value="15 km/h"
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

      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        <WeatherChart weatherData={WeatherChartData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        <CloudCoverWeatherChart cloudCoverData={cloudCoverData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-between items-center gap-4 text-center overflow-hidden  ">
        <MonthlyAverageTemperatureChart />
        <AvgHumidityChart />
        {/* <WindSpeedHeatmap /> */}
      </div>
      <ToastManager />
    </div>
  );
}
