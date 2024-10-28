import { BarChart2, Droplet, Thermometer, Upload, Wind } from "lucide-react";
import React, { useEffect, useState } from "react";
import WeatherChart from "./WeatherChart";
import MonthlyAverageTemperatureChart from "./MonthlyTemperatureChart";
import AvgHumidityChart from "./AvgHumidityChart";
import WindSpeedCategoriesChart from "./WindSpeedCategoriesChart";
import { motion } from "framer-motion";
import useFileUploadMutation from "@/app/hooks/use-file-upload";
import { ToastManager } from "./ToastManager";
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
  const weatherData = [
    {
      timestamp: "Day 1",
      temperature: 12,
      humidity: 60,
      pressure: 100,
      windSpeed: 5,
    },
    {
      timestamp: "Day 2",
      temperature: 25,
      humidity: 55,
      pressure: 300,
      windSpeed: 7,
    },
    {
      timestamp: "Day 3",
      temperature: 27,
      humidity: 65,
      pressure: 200,
      windSpeed: 6,
    },
    {
      timestamp: "Day 4",
      temperature: 24,
      humidity: 70,
      pressure: 140,
      windSpeed: 4,
    },
    {
      timestamp: "Day 5",
      temperature: 26,
      humidity: 60,
      pressure: 150,
      windSpeed: 8,
    },
    {
      timestamp: "Day 6",
      temperature: 23,
      humidity: 75,
      pressure: 1013,
      windSpeed: 5,
    },
    {
      timestamp: "Day 7",
      temperature: 28,
      humidity: 58,
      pressure: 140,
      windSpeed: 6,
    },
  ];

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

  const [, setData] = useState([]);

  useEffect(() => {
    let previousData = [];

    const handleSocketData = (serverData: any) => {
      console.log(serverData);
      if (previousData.length > 0) {
      }
      setData(serverData);
      previousData = serverData;
    };

    socket.on("weather", handleSocketData);

    return () => {
      socket.off("weather", handleSocketData);
    };
  }, []);

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
        <WeatherChart weatherData={weatherData} />
      </div>
      <div className=" w-full  bg-white rounded-xl shadow-lg p-12 flex justify-center text-center overflow-hidden  ">
        <WindSpeedCategoriesChart />
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
