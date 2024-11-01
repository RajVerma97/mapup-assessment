import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { WindSpeedDirectionData } from "@/types/dashboard";
import { useMediaQuery } from "react-responsive";

ChartJS.register(LinearScale, PointElement, Title, Tooltip, Legend);

interface WindSpeedDirectionChartProps {
  data: WindSpeedDirectionData[];
}

export default function WindSpeedDirectionChart({
  data,
}: WindSpeedDirectionChartProps) {
  const chartData = {
    datasets: [
      {
        label: "Wind Speed and Direction",
        data: data.map((item) => ({
          x: item.wind_direction_100m,
          y: item.wind_speed_100m,
          r: Math.max(5, item.wind_speed_100m * 20), // Minimum size of 5, scaled by wind speed
        })),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: 0,
        max: 360,
        title: {
          display: true,
          text: "Wind Direction (degrees)",
        },
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: "Wind Speed (m/s)",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Wind Speed vs Direction",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: never) => {
            // @ts-expect-error remove
            return `Direction: ${context.raw.x}°, Speed: ${context.raw.y} m/s`;
          },
        },
      },
    },
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        margin: "0 auto",
      }}
    >
      <Scatter
        width={isMobile ? "100%" : "250%"}
        height="100%"
        data={chartData}
        options={options}
      />
    </div>
  );
}
