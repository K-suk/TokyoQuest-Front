import { useState } from 'react';
import { completeQuest } from '../services/api';
import Modal from 'react-modal';

const CompleteQuestButton = ({ questId, onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [media, setMedia] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCompleteQuest = async (event) => {
        event.preventDefault();
        if (isLoading) return;

        // メディアファイルが選択されていない場合、アラートを表示
        if (!media) {
            alert('Please select a photo or video to upload.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('media', media);
            await completeQuest(questId, formData);
            if (onComplete) {
                onComplete(questId);
            }
        } catch (error) {
            console.error('Error completing quest:', error);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false); // モーダルを閉じる
        }
    };

    const handleFileChange = (event) => {
        setMedia(event.target.files[0]);
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-outline-dark mt-auto uniform-width">
                Complete Quest
            </button>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2>Upload Photo or Video</h2>
                <form onSubmit={handleCompleteQuest}>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Completing...' : 'Submit'}
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default CompleteQuestButton;