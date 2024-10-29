import { MonthlyHumidityData } from "@/types/dashboard";
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

interface AvgHumidityChartProps {
  data: MonthlyHumidityData[];
}

const AvgHumidityChart = ({ data }: AvgHumidityChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} width={350} height={400} margin={{ top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="avgHumidity"
          fill="lightblue"
          name="Average Humidity (%)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AvgHumidityChart;
