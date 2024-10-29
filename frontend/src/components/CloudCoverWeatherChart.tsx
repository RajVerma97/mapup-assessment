import { CloudCoverData } from "@/types/dashboard";
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

interface CloudCoverWeatherChartProps {
  data: CloudCoverData[];
}

export default function CloudCoverWeatherChart({
  data,
}: CloudCoverWeatherChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={700} height={400} data={data} margin={{ top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="avgLow"
          stackId="a"
          fill="#82ca9d"
          name="Low Cloud Cover (%)"
        />
        <Bar
          dataKey="avgMid"
          stackId="a"
          fill="#ff6f61"
          name="Medium Cloud Cover (%)"
        />
        <Bar
          dataKey="avgHigh"
          stackId="a"
          fill="#6fa3ef"
          name="High Cloud Cover (%)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
