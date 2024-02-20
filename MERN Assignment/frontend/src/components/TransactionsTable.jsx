import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth, setSelectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, currentPage, searchText]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/transactions?month=${selectedMonth}&page=${currentPage}&search=${searchText}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  return (
    <div className="mt-8 p-4 border rounded-md">
      <h1 className="text-2xl font-bold mb-4">Transactions Table</h1>

      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search Transaction"
          value={searchText}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md mr-2"
        />
        <button onClick={handleSearchClick} className="px-4 py-2 bg-blue-500 text-white rounded-md">Search</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="py-2 border">Title</th>
              <th className="py-2 border">Description</th>
              <th className="py-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="py-2 border">{transaction.title}</td>
                <td className="py-2 border">{transaction.description}</td>
                <td className="py-2 border">{transaction.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={handlePrevPage} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">Previous</button>
        <button onClick={handleNextPage} className="px-4 py-2 bg-gray-500 text-white rounded-md">Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
