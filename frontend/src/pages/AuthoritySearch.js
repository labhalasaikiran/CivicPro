import React, { useState } from 'react';
import API from '../api/axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AuthoritySearch = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);                 // FIXED
  const [selectedCivilian, setSelectedCivilian] = useState(null);
  const [error, setError] = useState('');

  // Search civilians
  const handleSearch = async () => {
    if (!query.trim()) return setError('Enter search query');

    try {
      const res = await API.get(
        `/authority/search-civilians?query=${encodeURIComponent(query)}`
      );
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching civilians');
      setData(null);
    }
  };

  // Fetch detailed civilian info
  const fetchDetails = async (id) => {
    try {
      const res = await API.get(`/authority/civilian-details/${id}`);
      setSelectedCivilian(res.data);
    } catch (err) {
      setError('Failed to fetch details');
    }
  };

  // Chart Data
  const chartData = data
    ? {
        labels: ['Good Deeds', 'Bad Deeds'],
        datasets: [
          {
            label: 'Counts',
            data: [data.goodDeeds?.length || 0, data.badDeeds?.length || 0],
            backgroundColor: ['#28a745', '#dc3545'],
            borderRadius: 6
          }
        ]
      }
    : null;

  return (
    <div className="container mt-4" style={{ maxWidth: 1000 }}>
      <h3 className="mb-3">Search Civilian Portal</h3>

      {/* Search Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter name, email, house number, phone, or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <div className="text-danger mb-3">{error}</div>}

      {/* Results Section */}
      {data && data.civilian && (
        <div className="search-results">
          {/* Profile + Chart */}
          <div className="profile-row">
            <div className="search-profile-card">
              <div className="profile-top">
                <img
                  src={data.civilian.profilePic || '/communityprologo.png'}
                  alt="avatar"
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h4>{data.civilian.name}</h4>
                  <div className="muted">{data.civilian.email}</div>
                  <div className="muted">House: {data.civilian.houseNo || 'N/A'}</div>
                  <div className="muted">Phone: {data.civilian.phone || 'N/A'}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div className="stat">
                  <div className="stat-num text-success">
                    {data.goodDeeds?.length || 0}
                  </div>
                  <div className="stat-label">Good Deeds</div>
                </div>

                <div className="stat">
                  <div className="stat-num text-danger">
                    {data.badDeeds?.length || 0}
                  </div>
                  <div className="stat-label">Bad Deeds</div>
                </div>

                <div className="stat">
                  <div className="stat-num text-muted">
                    {(data.goodDeeds?.length || 0) +
                      (data.badDeeds?.length || 0)}
                  </div>
                  <div className="stat-label">Total Records</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-card">
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              ) : (
                <div className="text-muted">No data</div>
              )}
            </div>
          </div>

          {/* Good + Bad Deeds Section */}
          <div className="deeds-section">

            {/* Good deeds */}
            <div className="deeds-list">
              <h5 className="section-title">Good Deeds</h5>
              {data.goodDeeds?.length > 0 ? (
                <ul className="list-plain">
                  {data.goodDeeds.map((d, i) => (
                    <li key={i} className="deed-item deed-good">
                      <strong>{d.content}</strong>
                      <div className="deed-meta">
                        {new Date(d.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No good deeds found.</p>
              )}
            </div>

            {/* Bad deeds */}
            <div className="deeds-list">
              <h5 className="section-title text-danger">Bad Deeds / Reports</h5>
              {data.badDeeds?.length > 0 ? (
                <ul className="list-plain">
                  {data.badDeeds.map((d, i) => (
                    <li key={i} className="deed-item deed-bad">
                      <strong>{d.content || d.reason}</strong>
                      <div className="deed-meta">
                        {new Date(d.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bad deeds or reports found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthoritySearch;
