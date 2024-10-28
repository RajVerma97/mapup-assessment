import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeatherData {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}
interface WeatherChartProps {
  weatherData: WeatherData[];
}

const WeatherChart = ({ weatherData }: WeatherChartProps) => {
  const colorSchemes = {
    option1: {
      temperature: "#ff6b6b", 
      humidity: "#4dabf7", 
      pressure: "#be4bdb", 
      windSpeed: "#20c997", 
    },
    option2: {
      temperature: "#ff6b6b", 
      humidity: "#4dabf7", 
      pressure: "#f06595", 
      windSpeed: "#20c997", 
    },
    option3: {
      temperature: "#ff6b6b", 
      humidity: "#4dabf7", 
      pressure: "#7950f2", 
      windSpeed: "#20c997", 
    },
    option4: {
      temperature: "#ff6b6b", 
      humidity: "#4dabf7", 
      pressure: "#e64980", 
      windSpeed: "#20c997", 
    },
    option5: {
      temperature: "#ff6b6b", 
      humidity: "#4dabf7", 
      pressure: "#cc5de8", 
      windSpeed: "#20c997", 
    },
  };

  
  const colors = colorSchemes.option4;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-lg backdrop-blur-sm">
          <p className="text-gray-700 font-semibold mb-3">{label}</p>
          {payload.map((item, index) => (
            <p
              key={index}
              className="text-sm font-medium flex items-center gap-2 mb-1.5"
              style={{ color: item.color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-gray-600">{item.name}:</span>
              <span className="font-semibold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-8 mt-6">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-[400px] p-6 bg-white rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={700}
          height={300}
          data={weatherData}
          margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f3f5"
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#495057", fontSize: 12 }}
            tickLine={{ stroke: "#dee2e6" }}
            axisLine={{ stroke: "#dee2e6" }}
            dy={10}
          />
          <YAxis
            tick={{ fill: "#495057", fontSize: 12 }}
            tickLine={{ stroke: "#dee2e6" }}
            axisLine={{ stroke: "#dee2e6" }}
            dx={-10}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#dee2e6", strokeDasharray: "5 5" }}
          />
          <Legend content={<CustomLegend />} />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke={colors.temperature}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: colors.temperature,
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />

          <Line
            type="monotone"
            dataKey="humidity"
            stroke={colors.humidity}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: colors.humidity,
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />

          <Line
            type="monotone"
            dataKey="pressure"
            stroke={colors.pressure}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: colors.pressure,
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />

          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke={colors.windSpeed}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: colors.windSpeed,
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;