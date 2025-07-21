

import React, { useState } from 'react';
import API from '../api/axios';

const ReportCivilian = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCivilian, setSelectedCivilian] = useState(null);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  // Search civilians far reporting
  const handleSearch = async () => {
    try {
      const res = await API.get(`/authority/search-civilians?query=${search}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Search failed');
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
        civilianId: selectedCivilian._id,
        content: description,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      });

      alert('Report submitted successfully!');


      // Reset
      setSelectedCivilian(null);
      setSearch('');
      setDescription('');
      setFile(null);
      setResults([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit report');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4">Report a Civilian</h3>

      {/* Search Section */}
      {!selectedCivilian && (
        <>
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Search by name, email, or house number..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={handleSearch}>
              Search
            </button>
          </div>

          {results.length > 0 &&
            results.map((user) => (
              <div key={user._id} className="card mb-2 p-2">
                <strong>{user.name}</strong> — {user.email}
                <button
                  className="btn btn-sm btn-success float-end"
                  onClick={() => setSelectedCivilian(user)}
                >
                  Select
                </button>
              </div>
            ))}
        </>
      )}

      {/* Report Form */}
      {selectedCivilian && (
        <form onSubmit={handleReport}>
          <p>
            Reporting: <strong>{selectedCivilian.name}</strong> ({selectedCivilian.email})
          </p>

          <div className="mb-3">
            <label>Description of Bad Deed</label>
            <textarea
              className="form-control"
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

  <div className="mb-3">
  <label>Upload Media (optional)</label>
  <input
  type="file"
   className="form-control"
  accept="image/*,video/*,audio/*"
 onChange={(e) => setFile(e.target.files[0])}
  />
  </div>

          <button type="submit" className="btn btn-danger">Submit Report</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setSelectedCivilian(null);
              setResults([]);
              setSearch('');
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportCivilian;
