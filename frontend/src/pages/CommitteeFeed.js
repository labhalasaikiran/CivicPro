import React, { useEffect, useState } from 'react';
import API from '../api/axios'; 
import { getUser } from '../utils/auth'; 

const CommitteeFeed = () => {
  const [feed, setFeed] = useState([]);
  const [comments, setComments] = useState({}); 
  const user = getUser(); 

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get('/committee/feed'); 
      setFeed(res.data);
    } catch (err) {
      console.error('Error fetching feed:', err);
    }
  };

  const handleCommentChange = (id, text) => {
    setComments((prev) => ({ ...prev, [id]: text }));
  };

  const handleCommentSubmit = async (id) => {
    try {
      await API.post(`/committee/${id}/comment`, {
        text: comments[id],
      });
      setComments((prev) => ({ ...prev, [id]: '' }));
      fetchFeed();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">🌐 Committee Feed</h2>
      {feed.length === 0 ? (
        <p className="text-center text-muted">No posts yet.</p>
      ) : (
        feed.map((post) => (
          <div key={post._id} className="card mb-4 shadow-lg border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="user"
                  width="50"
                  height="50"
                  className="rounded-circle me-3"
                />
                <div>
                  <h6 className="mb-0 fw-bold">{post.userId?.name}</h6>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              <p className="fs-5">{post.content}</p>

              {post.mediaUrl && (
                <div className="mb-3">
                  {post.mediaType === 'image' && (
                    <img
                      src={post.mediaUrl}
                      alt="media"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '300px' }}
                    />
                  )}
                  {post.mediaType === 'video' && (
                    <video controls className="w-100 rounded shadow">
                      <source src={post.mediaUrl} type="video/mp4" />
                    </video>
                  )}
                  {post.mediaType === 'audio' && (
                    <audio controls className="w-100">
                      <source src={post.mediaUrl} type="audio/mp3" />
                    </audio>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-3">
                <h6 className="fw-bold mb-2">Comments</h6>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((c, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 bg-light">
                      <strong>{c.userId?.name}</strong>: {c.content}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}

                {/* Add Comment */}
                <div className="d-flex mt-2">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Write a comment..."
                    value={comments[post._id] || ''}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleCommentSubmit(post._id)}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommitteeFeed;



