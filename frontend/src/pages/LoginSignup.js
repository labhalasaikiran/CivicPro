import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSignup = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('civilian');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

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
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <img src="https://www.shutterstock.com/image-vector/icon-illustration-concept-family-care-600nw-1077028331.jpg" alt="Logo" style={{ width: '80px', height: '80px', marginBottom: '10px' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'whitesmoke' }}>Civilian Credit System</h1>
        <p style={{ fontSize: '1rem', color: 'whitesmoke' }}>Track your civic deeds and stay accountable</p>
      </div>

      <div className="login-container">
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Signup'}</h2>

        <div className="d-flex justify-content-center gap-2 mb-3">
          <button
            type="button"
            className={`btn btn-sm ${role === 'civilian' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setRole('civilian')}
          >
            Civilian
          </button>
          <button
            type="button"
            className={`btn btn-sm ${role === 'authority' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setRole('authority')}
          >
            Authority
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          )}
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">{isLogin ? 'Login' : 'Signup'}</button>
        </form>

        <div className="text-center mt-3">
          <small>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span className="text-primary" role="button" style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Signup' : 'Login'}
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

