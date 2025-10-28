import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

const AuthorityDashboard = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const actions = [
    { to: '/authority/announcements', title: 'Announcements', variant: 'primary', icon: '📢' },
    { to: '/authority/complaints', title: 'Complaints', variant: 'warning', icon: '📝' },
    { to: '/authority/report', title: 'Report Civilian', variant: 'danger', icon: '🚫' },
    { to: '/committee-feed', title: 'Committee Feed', variant: 'success', icon: '✅' },
    { to: '/authority/search', title: 'Search Civilian', variant: 'info', icon: '🔎' },
    { to: '/authority/profile', title: 'Profile', variant: 'secondary', icon: '👤' },
    { to: '/authority/authentication', title: 'Authentication', variant: 'dark', icon: '🛡️' },
  ];

  return (
    <div className="authority-page d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm width-100%" >
        
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/authority">
            <img
              src="/communityprologo.png"
              alt="CommunityPro logo"
              className="me-2"
              style={{ width: 44, height: 44, borderRadius: 8 }}
            />
            <span className="fw-bold fs-5 text-black">CommunityPro</span>
          </Link>
          <div>
          <h1 className="fw-bold fs-5 text-black ">Authority Dashboard</h1>
        </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <div className="text-white small me-2">
              Welcome,&nbsp;<strong>{user?.name || 'User'}</strong>
            </div>
            <Link to="/authority/profile" className="btn btn-outline-light btn-sm">Profile</Link>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="text-white text-center py-5 position-relative"
        >
        <div className="container">
          <p className="lead mb-0 opacity-75 text-black  fw-semibold text-primary">
            Efficiently manage community activity, complaints, and announcements
          </p>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Quick Actions */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-lg-10">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body py-4 text-center">
                  <h4 className="card-title mb-2 fw-semibold text-dark">Quick Actions</h4>
                  <p className="text-muted mb-4">
                    Use the options below to manage community operations with ease
                  </p>
                  <div className="row g-3 justify-content-center mt-3">
                    {actions.map(a => (
                      <div key={a.title} className="col-6 col-sm-4 col-md-3 col-lg-2">
                        <Link
                          to={a.to}
                          className={`btn btn-lg w-100 bg-white border shadow-sm d-flex flex-column align-items-center justify-content-center gap-2 py-3 border-${a.variant}`}
                          style={{
                            borderWidth: 2,
                            borderRadius: '12px',
                            transition: 'all 0.25s ease',
                            fontSize: '0.9rem'
                          }}
                        >
                          <div style={{ fontSize: 36 }}>{a.icon}</div>
                          <small className="fw-semibold text-dark">{a.title}</small>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow border-0 rounded-4">
                <div className="card-body">
                  <h5 className="card-title fw-semibold text-primary">Empowering Authorities</h5>
                  <p className="card-text text-muted">
                    Manage reports, announcements, and complaints efficiently from a single
                    dashboard. Use approval queues to validate deeds and handle issues proactively.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 shadow border-0 rounded-4">
                <div className="card-body">
                  <h5 className="card-title fw-semibold text-primary">Community First</h5>
                  <p className="card-text text-muted">
                    Stay connected with residents, maintain transparency, and encourage
                    positive civic engagement with seamless communication and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-3 border-top mt-auto shadow-sm">
        <div className="container text-center small text-muted">
          © {new Date().getFullYear()} <strong>CommunityPro</strong> — Empowering Connected Communities
        </div>
      </footer>
    </div>
  );
};

export default AuthorityDashboard;
