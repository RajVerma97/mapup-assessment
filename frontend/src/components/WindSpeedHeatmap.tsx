import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// Sample data structure for weather conditions
const weatherData = [
  { category: "Temperature", value: 22 },
  { category: "Humidity", value: 75 },
  { category: "Wind Speed", value: 10 },
  { category: "Precipitation", value: 5 },
  { category: "Cloud Cover", value: 60 },
];

const WeatherRadarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart width={400} height={500} outerRadius="80%" data={weatherData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Weather Conditions"
          dataKey="value"
          stroke="#FF5733"
          fill="#FF5733"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default WeatherRadarChart;
