import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const AuthorityAuthentication = () => {
  const [pendingDeeds, setPendingDeeds] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const deedsRes = await API.get('/authority/pending-good-deeds');
    const complaintsRes = await API.get('/authority/pending-complaints');
    setPendingDeeds(deedsRes.data);
    setPendingComplaints(complaintsRes.data);
  };

  const handleValidate = async (type, id, status) => {
    const url = type === 'deed'
      ? `/authority/validate-good-deed/${id}`
      : `/authority/validate-complaint/${id}`;
    await API.put(url, { status });
    fetchPending();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      <h3 className="mb-4">Pending Good Deeds</h3>
      {pendingDeeds.length === 0 ? <p>No pending good deeds.</p> :
        pendingDeeds.map(deed => (
          <div key={deed._id} className="card mb-3">
            <div className="card-body">
              <strong>{deed.content}</strong>
              <div className="mb-2">
                {deed.mediaUrl && (
                  deed.mediaType === 'image' ? (
                    <img src={deed.mediaUrl} alt="" width="120" />
                  ) : deed.mediaType === 'video' ? (
                    <video controls src={deed.mediaUrl} width="180" />
                  ) : (
                    <audio controls src={deed.mediaUrl} />
                  )
                )}
              </div>
              <div className="mb-2">
                <span className="text-muted">By: {deed.userId?.name} ({deed.userId?.email})</span>
              </div>
              <div className="mt-2">
                <button className="btn btn-success btn-sm me-2" onClick={() => handleValidate('deed', deed._id, 'approved')}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleValidate('deed', deed._id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        ))
      }
      <hr className="my-5" />
      <h3 className="mb-4">Pending Complaints</h3>
      {pendingComplaints.length === 0 ? <p>No pending complaints.</p> :
        pendingComplaints.map(c => (
          <div key={c._id} className="card mb-3">
            <div className="card-body">
              <strong>{c.content}</strong>
              <div className="mb-2">
                {c.mediaUrl && (
                  c.mediaType === 'image' ? (
                    <img src={c.mediaUrl} alt="" width="120" />
                  ) : c.mediaType === 'video' ? (
                    <video controls src={c.mediaUrl} width="180" />
                  ) : (
                    <audio controls src={c.mediaUrl} />
                  )
                )}
              </div>
              <div className="mb-2">
                <span className="text-muted">By: {c.filedBy?.name} ({c.filedBy?.email})</span>
              </div>
              <div className="mt-2">
                <button className="btn btn-success btn-sm me-2" onClick={() => handleValidate('complaint', c._id, 'approved')}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleValidate('complaint', c._id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default AuthorityAuthentication;
