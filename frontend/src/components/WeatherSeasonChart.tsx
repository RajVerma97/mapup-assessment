import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { WeatherSeasonData } from "./Dashboard";

interface WeatherSeasonChartProps {
  data: WeatherSeasonData[];
}

export default function WeatherSeasonChart({ data }: WeatherSeasonChartProps) {
  const chartData = data.map((seasonData) => ({
    name: seasonData.formattedPeriod,
    AverageTemperature: seasonData.avgTemp,
    AverageHumidity: seasonData.avgDewPoint,
    AverageWindSpeed: seasonData.avgWindSpeed,
    AverageSoilTemperature: seasonData.avgSoilTemp,
  }));

  return (
    <BarChart width={800} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
      <XAxis
        dataKey="name"
        tickFormatter={(str) =>
          str
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        }
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 14, fill: "#666" }}
      />
      <YAxis tickLine={false} tick={{ fontSize: 14, fill: "#666" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="AverageTemperature" fill="orange" barSize={30} />
      <Bar dataKey="AverageHumidity" fill="skyblue" barSize={30} />
      <Bar dataKey="AverageWindSpeed" fill="#8884d8" barSize={30} />
      <Bar dataKey="AverageSoilTemperature" fill="#82ca9d" barSize={30} />
    </BarChart>
  );
}
