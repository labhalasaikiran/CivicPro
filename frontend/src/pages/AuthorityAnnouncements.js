import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorityAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [eventDateTime, setEventDateTime] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/authority/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      toast.error('Failed to load announcements.');
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
        eventDateTime,
      });

      toast.success('Announcement posted!');
      setTitle('');
      setDescription('');
      setFile(null);
      setEventDateTime('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error('Failed to post announcement.');
    }
  };

  const renderCountdown = (eventDateTime) => {
    const eventTime = new Date(eventDateTime).getTime();
    const now = Date.now();
    const diff = eventTime - now;

    if (diff <= 0) return <span className="text-danger">Event Started</span>;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return (
      <span className="text-success">
        Starts in {hours}h {minutes}m {seconds}s
      </span>
    );
  };

  const now = new Date();
  const upcomingAnnouncements = announcements.filter(
    (a) => new Date(a.eventDateTime) > now
  );
  const pastAnnouncements = announcements.filter(
    (a) => new Date(a.eventDateTime) <= now
  );

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <ToastContainer />

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
          <label className="form-label">Event Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={eventDateTime}
            onChange={(e) => setEventDateTime(e.target.value)}
            required
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

      {/* UPCOMING EVENTS */}
      <h4 className="text-primary">Upcoming Events</h4>
      {upcomingAnnouncements.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        upcomingAnnouncements.map((a, idx) => (
          <div key={idx} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{a.title}</h5>
              <p>{a.description}</p>
              {a.mediaUrl && (
                <div className="mb-2">
                  {a.mediaType === 'image' && (
                    <img
                      src={a.mediaUrl}
                      className="img-fluid rounded"
                      alt="event"
                      style={{ maxHeight: '300px' }}
                    />
                  )}
                  {a.mediaType === 'video' && (
                    <video src={a.mediaUrl} controls className="w-100 rounded" />
                  )}
                  {a.mediaType === 'audio' && (
                    <audio src={a.mediaUrl} controls className="w-100" />
                  )}
                </div>
              )}
              <div>{renderCountdown(a.eventDateTime)}</div>
              <small className="text-muted">
                Scheduled on: {new Date(a.eventDateTime).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}

      <hr className="my-5" />

      {/* PAST EVENTS */}
      <h4 className="text-secondary">Past Events</h4>
      {pastAnnouncements.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastAnnouncements.map((a, idx) => (
          <div key={idx} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{a.title}</h5>
              <p>{a.description}</p>
              {a.mediaUrl && (
                <div className="mb-2">
                  {a.mediaType === 'image' && (
                    <img
                      src={a.mediaUrl}
                      className="img-fluid rounded"
                      alt="event"
                      style={{ maxHeight: '300px' }}
                    />
                  )}
                  {a.mediaType === 'video' && (
                    <video src={a.mediaUrl} controls className="w-100 rounded" />
                  )}
                  {a.mediaType === 'audio' && (
                    <audio src={a.mediaUrl} controls className="w-100" />
                  )}
                </div>
              )}
              <small className="text-muted">
                Event occurred on: {new Date(a.eventDateTime).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AuthorityAnnouncements;
