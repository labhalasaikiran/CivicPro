import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import API from '../api/axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { getUser, logout } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const CivilianDashboard = () => {
  const [goodDeeds, setGoodDeeds] = useState([]);
  const [badDeeds, setBadDeeds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/civilian/dashboard');
        setGoodDeeds(res.data.goodDeeds || []);
        setBadDeeds(res.data.badDeeds || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const user = getUser();

  const chartData = {
    labels: ['Good Deeds', 'Bad Deeds'],
    datasets: [
      {
        label: 'Number of Deeds',
        data: [goodDeeds.length, badDeeds.length],
        backgroundColor: ['green', 'red'],
      },
    ],
  };

  return (
    <div>
      {/* header Navbar */}
      <nav className="civic-navbar">
        <Link to="/civilian/Home" className="civic-navbar-brand">Civic portal</Link>
        <div>
          <Link to="/civilian/post-deed" className="civic-navbar-link">Post Deed</Link>
          <Link to="/civilian/announcements" className="civic-navbar-link">Announcements</Link>
          <Link to="/civilian/complaints" className="civic-navbar-link">Complaints</Link>
          <Link to="/civilian/profile" className="civic-navbar-link">Profile</Link>
          <Link to="/committee-feed" className="civic-navbar-link">Committee Feed</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="civic-container">
        <div className="civic-header">
          <h2>Hello, {user?.name}</h2>
          <button className="civic-logout-btn" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>

        <h4 className="civic-summary-title">Your Civic Contribution Summary</h4>
        <div className="civic-chart-wrapper">
          <div className="civic-chart">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <hr />

        <div className="civic-deeds-row">
          {/* Good Deeds */}
          <div className="civic-deeds-col">
            <h5>Your Good Deeds</h5>
            {goodDeeds.length === 0 ? (
              <p>No good deeds yet.</p>
            ) : (
              goodDeeds.map((deed, idx) => (
                <div key={idx} className="civic-good-deed">
                  <strong>{deed.content}</strong><br />
                  {deed.mediaUrl && (
                    deed.mediaType === 'image' ? (
                      <img src={deed.mediaUrl} alt="" width="100" />
                    ) : deed.mediaType === 'video' ? (
                      <video controls src={deed.mediaUrl} width="200" />
                    ) : (
                      <audio controls src={deed.mediaUrl} />
                    )
                  )}
                </div>
              ))
            )}
          </div>

          {/* Bad Deeds */}
          <div className="civic-deeds-col">
            <h5>Reported Bad Deeds</h5>
            {badDeeds.length === 0 ? (
              <p>No bad deeds reported.</p>
            ) : (
              badDeeds.map((deed, idx) => (
                <div key={idx} className="civic-bad-deed">
                  <strong>{deed.content}</strong><br />
                  {deed.mediaUrl && (
                    deed.mediaType === 'image' ? (
                      <img src={deed.mediaUrl} alt="" width="100" />
                    ) : deed.mediaType === 'video' ? (
                      <video controls src={deed.mediaUrl} width="200" />
                    ) : (
                      <audio controls src={deed.mediaUrl} />
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CivilianDashboard;
// No changes needed unless you see a specific error in this file.
