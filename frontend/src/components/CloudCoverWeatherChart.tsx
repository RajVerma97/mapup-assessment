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
import { CloudCoverData } from "./Dashboard";

// Sample data for wind speed categorized by month
// const windSpeedData = [
//   { month: "January", low: 5, medium: 10, high: 2 },
//   { month: "February", low: 6, medium: 9, high: 3 },
//   { month: "March", low: 8, medium: 11, high: 4 },
//   { month: "April", low: 10, medium: 12, high: 6 },
//   { month: "May", low: 12, medium: 15, high: 5 },
//   { month: "June", low: 15, medium: 17, high: 8 },
//   { month: "July", low: 14, medium: 20, high: 10 },
//   { month: "August", low: 12, medium: 18, high: 9 },
//   { month: "September", low: 10, medium: 15, high: 4 },
//   { month: "October", low: 8, medium: 11, high: 3 },
//   { month: "November", low: 7, medium: 10, high: 2 },
//   { month: "December", low: 5, medium: 9, high: 1 },
// ];

interface CloudCoverWeatherChartProps {
  cloudCoverData: CloudCoverData[];
}

export default function CloudCoverWeatherChart({cloudCoverData}: CloudCoverWeatherChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={700}
        height={400}
        data={cloudCoverData}
        margin={{ top: 20 }}
      >
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
