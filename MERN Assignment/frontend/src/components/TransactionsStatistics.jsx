import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/statistics/${selectedMonth}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error.message);
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-md flex flex-col items-center">
  <h1 className="text-2xl font-bold mb-4 text-bold">Transactions Statistics</h1>
  <p className="mb-2 font-semibold">Total Sale Amount: {statistics.totalSaleAmount || 0}</p>
  <p className="mb-2 font-semibold" >Total Sold Items: {statistics.totalSoldItems || 0}</p>
  <p className="mb-2 font-semibold">Total Not Sold Items: {statistics.totalNotSoldItems || 0}</p>
</div>

  );
};

export default TransactionsStatistics;
