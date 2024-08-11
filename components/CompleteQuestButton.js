import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from 'src/styles/CompleteQuestButton.module.css'; // CompleteQuestButton.module.cssをインポート
import { completeQuest, isQuestCompleted } from '/services/api';

// モーダルのアプリ要素を設定
Modal.setAppElement('#__next');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    background: 'white',
    borderRadius: '4px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    marginBottom: '20px',
    zIndex: '1050', // z-indexを高く設定
  },
  overlay: {
    zIndex: '1040', // overlayのz-indexも設定
  },
};

function CompleteQuestButton({ questId, onComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkIfCompleted = async () => {
      try {
        const completed = await isQuestCompleted(questId);
        setIsCompleted(completed);
      } catch (error) {
        console.error('Error checking if quest is completed:', error);
      }
    };

    checkIfCompleted();
  }, [questId]);

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
      await completeQuest(questId, selectedFile);
      if (onComplete) {
        onComplete(questId);
      }
      setIsCompleted(true);
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
      <button 
        onClick={openModal} 
        disabled={isLoading || isCompleted} 
        className={`btn ${isCompleted ? 'btn-dark text-white' : 'btn-outline-dark'} mt-auto uniform-width ${styles.saveButton}`}
      >
        {isLoading ? 'Completing...' : isCompleted ? 'Completed' : 'Complete Quest'}
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
        <div className={styles.modalButtons}>
          <button onClick={handleCompleteQuest} disabled={isLoading} className={`btn btn-outline-dark ${styles.modalButton}`}>
            {isLoading ? 'Uploading...' : 'Upload and Complete'}
          </button>
          <button onClick={closeModal} className={`btn btn-outline-dark ${styles.modalButton}`}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default CompleteQuestButton;