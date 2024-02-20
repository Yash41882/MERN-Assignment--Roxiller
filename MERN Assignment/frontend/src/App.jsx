// app.jsx
import React, { useState } from 'react';
import TransactionsTable from "./components/TransactionsTable"; 
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('01');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container mx-auto p-8 bg-zinc-200 ">
      <h1 className="text-4xl font-bold text-red-800 mb-6 flex align-center justify-center underline">MERN ASSIGNMENT</h1>
      <label className="block flex align-center justify-center">
        <p className='mt-2'>Select Month to view Product Details:</p> 
        <select className="border p-2 px-4 py-2 border rounded-md ml-2" value={selectedMonth} onChange={handleMonthChange}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </label>

      <TransactionsTable selectedMonth={selectedMonth} />
      <TransactionsStatistics selectedMonth={selectedMonth} />
      <TransactionsBarChart selectedMonth={selectedMonth} />
    </div>
  );
}

export default App;
