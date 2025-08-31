import { useEffect, useState } from "react";
import Card from "../components/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/ev_data.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const registrationsByYear = data.reduce((acc, row) => {
    acc[row.Year] = (acc[row.Year] || 0) + row.Registrations;
    return acc;
  }, {});

  const lineData = Object.keys(registrationsByYear).map((year) => ({
    year,
    registrations: registrationsByYear[year],
  }));

  const typeData = data.reduce((acc, row) => {
    acc[row.Type] = (acc[row.Type] || 0) + row.Registrations;
    return acc;
  }, {});

  const pieData = Object.keys(typeData).map((type) => ({
    name: type,
    value: typeData[type],
  }));

  return (
    <div className="p-6 grid gap-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>📊 Total EVs: {lineData.reduce((a, b) => a + b.registrations, 0)}</Card>
        <Card>👥 Manufacturers: {new Set(data.map((d) => d.Manufacturer)).size}</Card>
        <Card>📈 Years Covered: {new Set(data.map((d) => d.Year)).size}</Card>
      </div>

      <Card>
        <h2 className="font-bold mb-2">EV Registrations Over Time</h2>
        <LineChart width={500} height={250} data={lineData}>
          <XAxis dataKey="year" />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Tooltip />
          <Line type="monotone" dataKey="registrations" stroke="#8884d8" />
        </LineChart>
      </Card>

      <Card>
        <h2 className="font-bold mb-2">EV Types Distribution</h2>
        <PieChart width={400} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            <Cell fill="#82ca9d" />
            <Cell fill="#ffc658" />
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </Card>
    </div>
  );
}
