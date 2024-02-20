import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TransactionsBarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/bar-chart/${selectedMonth}`);
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error.message);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-bold flex justify-center align-center">Transactions Bar Chart</h1>
      <div className="bg-white p-4 rounded-md shadow-md">
        <BarChart width={500} height={300} data={barChartData} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </div>
    </div>
  );
};

export default TransactionsBarChart;
