import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AuthorityDashboard = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: 'skyblue', minHeight: '100vh' }}>
     
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Welcome, {user?.name}</h3>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <Link to="/authority/announcements" className="btn btn-primary w-100">
              📢 Announcements
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/authority/complaints" className="btn btn-warning w-100">
              📝 Complaints
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/authority/report" className="btn btn-danger w-100">
              🚫 Report Civilian
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/committee-feed" className="btn btn-success w-100">
              ✅ Committee Feed
            </Link>
          </div>
          <div className='col-md-4'>
           <Link to = "/authority/search" className="btn btn-info w-100">
            Search Civilian Portal
           </Link>
          </div>
        </div>
      </div>

     
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left',
          backgroundColor: 'skyblue',
          padding: '40px',
        }}
      >

        
        <div style={{ flex: '1', textAlign: 'center' }}>
          <img
            src="https://media.licdn.com/dms/image/v2/C4E1BAQFHTYMh1_vzhQ/company-background_10000/company-background_10000/0/1597099806172/community_protection_services_cover?e=2147483647&v=beta&t=VtfdB7XQLwIirEf_sM2wPmaqGLGKIDuAVVEExwqYD4c"
            alt="Authority Visual"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '450px' }}
          />
        </div>


        
        <div style={{ flex: '1', paddingRight: '20px' }}>
          <h2 style={{ fontWeight: 'bold' }}>Empowering Authorities</h2>
          <p style={{ fontSize: '18px', color: '#555' }}>
            Manage reports, announcements, and complaints efficiently from a single dashboard.
          </p>
        </div>


        
        <div style={{ flex: '1', paddingLeft: '20px' }}>
          <h2 style={{ fontWeight: 'bold' }}>Community First</h2>
          <p style={{ fontSize: '18px', color: '#555' }}>
            Stay connected with civilians and ensure a transparent civic system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
