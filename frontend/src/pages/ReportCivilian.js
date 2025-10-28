

import React, { useState } from 'react';
import API from '../api/axios';

const ReportCivilian = () => {
  const [search, setSearch] = useState('');
  const [civilian, setCivilian] = useState(null);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  // Search civilians far reporting
  const handleSearch = async () => {
    try {
      const res = await API.get(`/authority/search-civilians?query=${search}`);
      setCivilian(res.data.civilian);
    } catch {
      setCivilian(null);
      alert('Civilian not found');
    }
  };

  
  const handleUpload = async () => {
    if (!file) return { mediaUrl: null, mediaType: null };
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/upload', formData);
    return { mediaUrl: res.data.url, mediaType: res.data.type };
  };

  // Report civilian
  const handleReport = async (e) => {
    e.preventDefault();
    try {
      const media = await handleUpload();
      await API.post('/authority/report', {
        civilianId: civilian._id,
        content: description,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      });
      alert('Report submitted!');
      resetForm();
    } catch {
      alert('Failed to report.');
    }
  };

  const resetForm = () => {
    setCivilian(null);
    setSearch('');
    setDescription('');
    setFile(null);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4">Report a Civilian</h3>
      {!civilian ? (
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Search by name, email, house number, phone, or address..."
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      ) : (
        <form onSubmit={handleReport}>
          <div className="mb-3">
            <strong>Name:</strong> {civilian.name}<br />
            <strong>Email:</strong> {civilian.email}<br />
            <strong>House No:</strong> {civilian.houseNo}<br />
            <strong>Phone:</strong> {civilian.phone}<br />
            <strong>Address:</strong> {civilian.address}
          </div>
          <div className="mb-3">
            <label>Description of Bad Deed</label>
            <textarea
              className="form-control"
              rows="4"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Upload Media (optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,video/*,audio/*"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-danger">Submit Report</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportCivilian;
