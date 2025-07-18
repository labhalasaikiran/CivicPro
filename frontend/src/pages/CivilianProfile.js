import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const CivilianProfile = () => {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    phone: '',
    age: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/civilian/profile');
        setProfile(res.data);
        setFormData({
          phone: res.data.phone || '',
          age: res.data.age || '',
          address: res.data.address || ''
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/upload', formData);
    return res.data.url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleUpload();

      const payload = {
        ...formData,
        profilePic: imageUrl || profile.profilePic,
      };

      const res = await API.put('/civilian/profile', payload);
      alert('Profile updated!');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!profile) return <p className="mt-5 text-center">Loading profile...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Your Profile</h3>
      <form onSubmit={handleUpdate}>
        <div className="mb-3 text-center">
          {profile.profilePic ? (
            <img src={profile.profilePic} alt="Profile" className="rounded-circle" width="100" />
          ) : (
            <p>No profile picture</p>
          )}
          <input type="file" className="form-control mt-2" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </div>

        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" value={profile.name} disabled />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={profile.email} disabled />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Age</label>
          <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows="2" />
        </div>
        <button className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default CivilianProfile;
