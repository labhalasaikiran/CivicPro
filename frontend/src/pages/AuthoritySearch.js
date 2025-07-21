
import React, { useState } from 'react';
import API from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AuthoritySearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCivilian, setSelectedCivilian] = useState(null);
  const [error, setError] = useState('');

  // Step 1: Search civilians by name/email/houseNo
  const handleSearch = async () => {
    try {
      const res = await API.get(`/authority/search-civilians?query=${query}`);
      setResults(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching civilians');
      setResults([]);
    }
  };

  // Step 2: Fetch full details of a selected civilian
  const fetchDetails = async (id) => {
    try {
      const res = await API.get(`/authority/civilian-details/${id}`);
      setSelectedCivilian(res.data);
    } catch (err) {
      setError('Failed to fetch details');
    }
  };

  const chartData = selectedCivilian ? {
    labels: ['Good Deeds', 'Bad Deeds'],
    datasets: [
      {
        label: 'Count',
        data: [
          selectedCivilian.goodDeeds.length,
          selectedCivilian.badDeeds.length
        ],
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

      {!selectedCivilian && results.length > 0 && (
        <div>
          <h5>Select a Civilian:</h5>
          {results.map((civ) => (
            <div key={civ._id} className="d-flex justify-content-between border p-2 mb-2">
              <span>{civ.name} ({civ.email})</span>
              <button className="btn btn-sm btn-info" onClick={() => fetchDetails(civ._id)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCivilian && (
        <div>
          <h4>{selectedCivilian.civilian.name} ({selectedCivilian.civilian.email})</h4>
          <p>House No: {selectedCivilian.civilian.houseNo}</p>

          <div style={{ width: '400px', margin: '20px auto' }}>
            <Bar data={chartData} />
          </div>

          <h5>Good Deeds:</h5>
          <ul>{selectedCivilian.goodDeeds.map((d, i) => <li key={i}>{d.content}</li>)}</ul>

          <h5>Bad Deeds:</h5>
          <ul>{selectedCivilian.badDeeds.map((d, i) => <li key={i}>{d.content}</li>)}</ul>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => setSelectedCivilian(null)}
          >
            Back to Results
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthoritySearch;
