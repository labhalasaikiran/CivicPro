import React, { useState } from 'react';
import API from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AuthoritySearch = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const res = await API.get(`/users/civilians/search?query=${query}`);
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching civilian');
      setData(null);
    }
  };

  const chartData = data ? {
    labels: ['Good Deeds', 'Bad Deeds'],
    datasets: [
      {
        label: 'Count',
        data: [data.goodDeeds.length, data.badDeeds.length],
        backgroundColor: ['#4caf50', '#f44336']
      }
    ]
  } : null;

  return (
    <div className="container mt-4">
      <h2>Search Civilian Portal</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter name, email, or house number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {data && (
        <div>
          <h4>{data.civilian.name} ({data.civilian.email})</h4>
          <p>House No: {data.civilian.houseNo}</p>

          <div style={{ width: '400px', margin: '20px auto' }}>
            <Bar data={chartData} />
          </div>

          <h5>Good Deeds:</h5>
          <ul>{data.goodDeeds.map((d, i) => <li key={i}>{d.content}</li>)}</ul>

          <h5>Bad Deeds:</h5>
          <ul>{data.badDeeds.map((d, i) => <li key={i}>{d.reason}</li>)}</ul>
        </div>
      )}
    </div>
  );
};

export default AuthoritySearch;
