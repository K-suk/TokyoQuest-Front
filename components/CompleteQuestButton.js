import { useState } from 'react';
import { completeQuest } from '../services/api';
import Modal from 'react-modal'; // 追加部分

const CompleteQuestButton = ({ questId, onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);

    const handleCompleteQuest = async (event) => {
        event.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('media', mediaFile);
            await completeQuest(questId, formData);
            if (onComplete) {
                onComplete(questId);
            }
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error completing quest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setMediaFile(event.target.files[0]);
    };

    return (
        <>
            <button onClick={() => setModalIsOpen(true)} disabled={isLoading} className="btn btn-outline-dark mt-auto uniform-width">
                {isLoading ? 'Completing...' : 'Complete Quest'}
            </button>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>Upload Media</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleCompleteQuest} disabled={isLoading || !mediaFile}>
                    {isLoading ? 'Completing...' : 'Submit'}
                </button>
                <button onClick={() => setModalIsOpen(false)}>Cancel</button>
            </Modal>
        </>
    );
};

export default CompleteQuestButton;