import { CloudCoverData } from "@/types/dashboard";
import React from "react";
import { useMediaQuery } from "react-responsive";
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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div className="w-full center h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={isMobile ? 300 : 600}
          height={isMobile ? 400 : 400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            height={60}
            interval={0}
          />
          <YAxis tick={{ fontSize: 12 }} width={40} />
          <Tooltip />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
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
    </div>
  );
}
