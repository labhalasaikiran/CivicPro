import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/civilian/dashboard">Civic Portal</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/civilian/post-deed">Post Good Deed</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/civilian/announcements">Announcements</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/civilian/complaints">Complaints</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/civilian/profile">Profile</Link>
          </li>
        </ul>
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
