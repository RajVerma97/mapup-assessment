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
import { MonthlyTemperatureData } from "./Dashboard";

interface MonthlyTemperatureChartProps {
  data: MonthlyTemperatureData[];
}

const MonthlyAverageTemperatureChart = ({
  data,
}: MonthlyTemperatureChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} width={350} height={400} margin={{ top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgTemp" fill="orange" name="Average Temperature (°C)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyAverageTemperatureChart;
