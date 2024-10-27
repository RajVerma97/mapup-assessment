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

const humidityData = [
  { month: "January", avgHumidity: 80 },
  { month: "February", avgHumidity: 75 },
  { month: "March", avgHumidity: 70 },
  { month: "April", avgHumidity: 65 },
  { month: "May", avgHumidity: 60 },
  { month: "June", avgHumidity: 55 },
  { month: "July", avgHumidity: 50 },
  { month: "August", avgHumidity: 55 },
  { month: "September", avgHumidity: 60 },
  { month: "October", avgHumidity: 70 },
  { month: "November", avgHumidity: 75 },
  { month: "December", avgHumidity: 80 },
];

const AvgHumidityChart = ({ data = humidityData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} width={350} height={400} margin={{ top: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
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
