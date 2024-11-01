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
import { useMediaQuery } from "react-responsive";
import { MonthlyTemperatureData } from "@/types/dashboard";

interface MonthlyTemperatureChartProps {
  data: MonthlyTemperatureData[];
}

const MonthlyAverageTemperatureChart = ({
  data,
}: MonthlyTemperatureChartProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <BarChart
        data={data}
        width={isMobile ? 250 : 350}
        height={isMobile ? 300 : 400}
        margin={{ top: 20 }}
      >
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
