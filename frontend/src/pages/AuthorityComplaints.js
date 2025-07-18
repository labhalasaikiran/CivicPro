import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const AuthorityComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/authority/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return { mediaUrl: null, mediaType: null };
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/upload', formData);
    return { mediaUrl: res.data.url, mediaType: res.data.type };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const media = await handleUpload();

      await API.post('/authority/complaints', {
        content,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      });

      alert('Complaint submitted!');
      setContent('');
      setFile(null);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4">File a Complaint</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Complaint</label>
          <textarea
            className="form-control"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Attach Media (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*,video/*,audio/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-warning">Submit</button>
      </form>

      <hr className="my-5" />
      <h4>All Complaints</h4>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((c, i) => (
          <div key={i} className="card mb-3">
            <div className="card-body">
              <p>{c.content}</p>
              {c.mediaUrl && (
                c.mediaType === 'image' ? (
                  <img src={c.mediaUrl} width="100%" alt="media" />
                ) : c.mediaType === 'video' ? (
                  <video src={c.mediaUrl} controls width="100%" />
                ) : (
                  <audio src={c.mediaUrl} controls />
                )
              )}
              <small className="text-muted">Submitted on {new Date(c.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AuthorityComplaints;
