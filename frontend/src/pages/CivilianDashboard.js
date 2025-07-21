
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
      <nav className="bg-success text-white py-2 px-4 d-flex justify-content-between align-items-center text ">
        <div className="fw-bold">Civic Portal</div>
        <div>
          <Link to="/civilian/post-deed" className="text-white text-decoration-none me-3">Post Deed </Link>
          <Link to="/civilian/announcements" className="text-white text-decoration-none  me-3">Announcements</Link>
          <Link to="/civilian/complaints" className="text-white text-decoration-none  me-3">Complaints</Link>
          <Link to="/civilian/profile" className="text-white text-decoration-none  me-3">Profile</Link>
          <Link to="/committee-feed" className="text-white text-decoration-none  me-3">Committee Feed</Link>
        </div>
      </nav>

{/* Main Content */}
  <div className="container mt-5">
     <div className="d-flex justify-content-between mb-4">
    <h2>Hello, {user?.name}</h2>
          <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>

        <h4 className="mb-3">Your Civic Contribution Summary</h4>
        <div className="d-flex justify-content-center my-4">
          <div style={{ width: '400px', height: '300px' }}>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <hr />

        <div className=" bg-light row mt-4">
          {/* Good Deeds */}
          <div className="col-md-6">
            <h5>Your Good Deeds</h5>
            {goodDeeds.length === 0 ? (
              <p>No good deeds yet.</p>
            ) : (
              goodDeeds.map((deed, idx) => (
                <div key={idx} className="alert alert-success">
                  <strong>{deed.content}</strong><br />
                  {deed.mediaUrl && (
                    deed.mediaType === 'image' ? (
                      <img src={deed.mediaUrl} alt="" width="300" />
                    ) : deed.mediaType === 'video' ? (
                      <video controls src={deed.mediaUrl} width="300" />
                    ) : (
                      <audio controls src={deed.mediaUrl} />
                    )
                  )}
                </div>
              ))
            )}
          </div>

{/* Bad Deeds */}
  <div className="col-md-6">
      <h5>Reported Bad Deeds</h5>
        {badDeeds.length === 0 ? (
   <p>No bad deeds reported.</p>
            ) : (
              badDeeds.map((deed, idx) => (
                <div key={idx} className="alert alert-danger">
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
