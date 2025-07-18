
import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AuthorityAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/authority/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
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
      await API.post('/authority/announcements', {
        title,
        description,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      });

      alert('Announcement posted!');
      setTitle('');
      setDescription('');
      setFile(null);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Failed to post announcement.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4">Post an Announcement</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Attach Media (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*,video/*,audio/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-success">Post Announcement</button>
      </form>

      <hr className="my-5" />

      <h4>All Announcements</h4>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a, idx) => (
          <div key={idx} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{a.title}</h5>
              <p className="card-text">{a.description}</p>

              {a.mediaUrl && (
                <div className="mb-3">
                  {a.mediaType === 'image' && (
                    <img
                      src={a.mediaUrl}
                      alt="Announcement"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px' }}
                    />
                  )}
                  {a.mediaType === 'video' && (
                    <video controls src={a.mediaUrl} className="w-100 rounded" />
                  )}
                  {a.mediaType === 'audio' && (
                    <audio controls src={a.mediaUrl} className="w-100" />
                  )}
                </div>
              )}

              <small className="text-muted">
                Posted on {new Date(a.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AuthorityAnnouncements;

