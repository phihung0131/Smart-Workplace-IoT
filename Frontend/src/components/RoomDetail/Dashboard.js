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
import { Card } from "react-bootstrap";
import "./Dashboard.scss";

const Dashboard = ({ chartData }) => {
  return (
    <Card className="dashboard-card">
      <Card.Header className="dashboard-card__header">
        <h2>Biểu đồ Nhiệt độ, Độ ẩm và Ánh sáng</h2>
      </Card.Header>
      <Card.Body className="dashboard-card__content">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ff0000"
              activeDot={{ r: 8 }}
              name="Nhiệt độ"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#0000ff"
              activeDot={{ r: 8 }}
              name="Độ ẩm"
            />
            <Line
              type="monotone"
              dataKey="light"
              stroke="#00ff00"
              activeDot={{ r: 8 }}
              name="Ánh sáng"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default Dashboard;
