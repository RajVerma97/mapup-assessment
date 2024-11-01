import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  RadialLinearScale,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { DailyWeatherData } from "@/types/dashboard";
import { useMediaQuery } from "react-responsive";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, RadialLinearScale);

interface DailyWeatherChartProps {
  data: DailyWeatherData[];
}

export default function DailyWeatherChart({ data }: DailyWeatherChartProps) {
  const chartData = {
    labels: ["Rain", "Precipitation", "Snowfall"],
    datasets: data.map((item, index) => ({
      label: ` ${index + 1}`,
      data: [item.avgRain, item.avgPrecipitation, item.avgSnowfall],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    })),
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div
      style={{
        width: isMobile ? "100%" : "50%",
        height: "100%",
        margin: "0 auto",
      }}
    >
      <PolarArea data={chartData} />
    </div>
  );
}
