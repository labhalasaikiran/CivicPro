import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await API.get('/civilian/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Community Announcements</h3>

      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a, index) => (
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <h5 className="card-title">{a.title}</h5>
              <p className="card-text">{a.description}</p>
              {a.mediaUrl && (
                a.mediaType === 'image' ? (
                  <img src={a.mediaUrl} alt="announcement" width="100%" />
                ) : a.mediaType === 'video' ? (
                  <video controls src={a.mediaUrl} width="100%" />
                ) : (
                  <audio controls src={a.mediaUrl} />
                )
              )}
              <small className="text-muted d-block mt-2">
                Posted on {new Date(a.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
