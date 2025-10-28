import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await API.get('/civilian/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  const now = new Date();
  const upcomingAnnouncements = announcements.filter(
    (a) => new Date(a.eventDateTime) > now
  );
  const pastAnnouncements = announcements.filter(
    (a) => new Date(a.eventDateTime) <= now
  );

  const renderCountdown = (eventDateTime) => {
    const eventTime = new Date(eventDateTime).getTime();
    const diff = eventTime - Date.now();
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

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4">Community Announcements</h3>
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
                      style={{ maxHeight: '300px', width: '100%' }}
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
              <div className='countdown text-end'>{renderCountdown(a.eventDateTime)}</div>
              <small className=" text-end ">
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
              <small className="text-muted text-end">
                Event occurred on: {new Date(a.eventDateTime).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
