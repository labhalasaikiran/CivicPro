import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/auth';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('civilian');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showAbout, setShowAbout] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const route = isLogin ? '/auth/login' : '/auth/signup';
      const payload = { ...formData, role };
      if (isLogin) delete payload.name;

      const { data } = await API.post(route, payload);
      saveAuth(data.token, data.user);
      navigate(`/${data.user.role}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={`login-bg login-gradient ${isLogin ? 'is-login' : 'is-signup'}`}>
      <div className="login-row">
        {/* Left: Login/Signup Card */}
        <div className="login-right">
          <div className="login-card login-card-attractive">
            <h1 className="login-welcome text-success">CommunityPro</h1>
            <p className="login-tagline">Change Starts with Us</p>
            <h2 className="login-card-title">
              {isLogin ? 'Log In' : 'Sign Up'}
            </h2>
            <div className="login-role-switch">
              <button
                type="button"
                className={role === 'civilian' ? 'login-role-btn active' : 'login-role-btn'}
                onClick={() => setRole('civilian')}
              >
                Civilian
              </button>
              <button
                type="button"
                className={role === 'authority' ? 'login-role-btn active' : 'login-role-btn'}
                onClick={() => setRole('authority')}
              >
                Authority
              </button>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="login-field">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter your name"
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              )}
              <div className="login-field">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="login-field">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <button type="submit" className="login-submit-btn">
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
              {isLogin && (
                <div className="login-forgot">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              )}
            </form>
            <hr className="login-divider" />
            <div className="login-toggle">
              <small>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span className="login-toggle-link" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign Up' : 'Log In'}
                </span>
              </small>
            </div>
          </div>
        </div>
        {/* Right: Logo and inline About (in-place) */}
        <div className={`login-logo-side ${showAbout ? 'show-about' : ''}`}>
          {!showAbout && (
            <img
              src="/communityprologo.png"
              alt="Logo"
              className="login-logo-large"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowAbout(true)}
            />
          )}

          {showAbout && (
            // about-inplace replaces the logo area (no modal)
            <div className="about-inplace background-color-light">
              <button className="about-inplace-close" onClick={() => setShowAbout(false)}>
                &times;
              </button>
              <div className="about-inplace-inner">
                <h2>Welcome to CommunityPro</h2>
                <p>
                  <strong>CommunityPro</strong> is your comprehensive platform for community engagement and civic responsibility.
                </p>

                <h3>Key Features</h3>
                <ul>
                  <li>Track and report community activities</li>
                  <li>Real-time complaints management</li>
                  <li>Direct communication with authorities</li>
                  <li>Event announcements and updates</li>
                  <li>Transparent deed verification system</li>
                </ul>

                <p>
                  <strong>Our Mission:</strong> Building stronger, more connected communities through transparency and collaboration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;