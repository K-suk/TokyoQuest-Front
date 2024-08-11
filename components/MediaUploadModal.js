import { useState } from 'react';
import axios from 'axios';

function MediaUploadModal({ questId, onComplete, onClose }) {
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setMedia(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!media) {
      setMessage('Please select a media file before completing the quest.');
      return;
    }

    const formData = new FormData();
    formData.append('media', media);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      await axios.post(`/api/quests/${questId}/complete/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Quest completed successfully!');
      onComplete(questId);
    } catch (error) {
      console.error('Error completing quest:', error);
      setMessage('Error completing quest. Please try again.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div>
      <h2>Upload Media</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="media">Upload Photo/Video:</label>
          <input type="file" id="media" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload and Complete'}
        </button>
        <button onClick={onClose}>Close</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MediaUploadModal;
