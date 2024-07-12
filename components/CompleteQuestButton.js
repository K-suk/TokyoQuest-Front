import React, { useState } from 'react';
import Modal from 'react-modal'; // 追加
import { completeQuest } from '../services/api';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const CompleteQuestButton = ({ questId, onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCompleteQuest = async (event) => {
        event.stopPropagation();
        if (isLoading || !selectedFile) {
            if (!selectedFile) {
                setErrorMessage('Please select a media file to upload.');
            }
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('media', selectedFile);
    
            // FormDataの内容を確認
            for (let [key, value] of formData.entries()) { 
                console.log(key, value);
            }
    
            await completeQuest(questId, formData);
            if (onComplete) {
                onComplete(questId);
            }
            closeModal();
        } catch (error) {
            console.error('Error completing quest:', error);
        } finally {
            setIsLoading(false);
        }
    };    

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrorMessage('');
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setErrorMessage('');
    };

    return (
        <>
            <button onClick={openModal} className="btn btn-outline-dark mt-auto uniform-width">
                {isLoading ? 'Completing...' : 'Complete Quest'}
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Upload Media"
            >
                <h2>Upload Media</h2>
                <input type="file" onChange={handleFileChange} />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button onClick={handleCompleteQuest} disabled={isLoading} className="btn btn-outline-dark mt-auto uniform-width">
                    {isLoading ? 'Uploading...' : 'Upload and Complete'}
                </button>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </>
    );
};

export default CompleteQuestButton;