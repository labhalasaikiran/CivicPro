import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    // At least 8 chars, one letter, one number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setMsg('Password must be at least 8 characters long and contain at least one letter and one number.');
      return;
    }
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setMsg('Password reset successful. You can now log in.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error resetting password.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="At least 8 characters, one letter and one number"
          />
        </div>
        <button className="btn btn-success w-100">Reset Password</button>
      </form>
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
      <div className="mt-2 text-muted" style={{ fontSize: '0.95em' }}>
        Password must be at least 8 characters long and contain at least one letter and one number.
      </div>
    </div>
  );
};

export default ResetPassword;
