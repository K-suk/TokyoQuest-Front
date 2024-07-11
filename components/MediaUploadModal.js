// components/MediaUploadModal.js
import { useState } from 'react';
import axios from 'axios';

const MediaUploadModal = ({ questId, onComplete, onClose }) => {
    const [media, setMedia] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setMedia(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('media', media);

        try {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');
            await axios.post(`/api/quests/${questId}/complete/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
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
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="media">Upload Photo/Video:</label>
                        <input type="file" id="media" accept="image/*,video/*" onChange={handleFileChange} />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Complete Quest'}
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <style jsx>{`
                .modal {
                    display: block;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgb(0,0,0);
                    background-color: rgba(0,0,0,0.4);
                    padding-top: 60px;
                }
                .modal-content {
                    background-color: #fefefe;
                    margin: 5% auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default MediaUploadModal;