import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { month: "January", avgTemp: 5 },
  { month: "February", avgTemp: 7 },
  { month: "March", avgTemp: 12 },
  { month: "April", avgTemp: 16 },
  { month: "May", avgTemp: 20 },
  { month: "June", avgTemp: 25 },
  { month: "July", avgTemp: 28 },
  { month: "August", avgTemp: 27 },
  { month: "September", avgTemp: 22 },
  { month: "October", avgTemp: 15 },
  { month: "November", avgTemp: 10 },
  { month: "December", avgTemp: 6 },
];

const MonthlyAverageTemperatureChart = ({ data = sampleData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} width={350} height={400} margin={{ top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgTemp" fill="orange" name="Average Temperature (°C)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyAverageTemperatureChart;
