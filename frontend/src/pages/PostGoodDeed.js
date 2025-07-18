import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PostGoodDeed = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return { mediaUrl: null, mediaType: null };

    const formData = new FormData();
    formData.append('file', file);

    const res = await API.post('/upload', formData);
    return {
      mediaUrl: res.data.url,
      mediaType: res.data.type,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const media = await handleUpload();

      const payload = {
        content,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      };

      await API.post('/civilian/good-deeds', payload);
      alert('Good deed submitted!');
      navigate('/civilian');
    } catch (err) {
      console.error(err);
      alert('Error posting good deed.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Post a Good Deed</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" rows="4" value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Attach Media (image, audio, video)</label>
          <input type="file" name="file" className="form-control" accept="image/*,video/*,audio/*" onChange={e => setFile(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-success">Submit Deed</button>
      </form>
    </div>
  );
};

export default PostGoodDeed;
