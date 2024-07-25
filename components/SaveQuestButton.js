import React, { useState, useEffect } from 'react';
import { saveQuest, isQuestSaved } from '../services/api';
import styles from 'src/styles/SaveQuestButton.module.css';

const SaveQuestButton = ({ questId, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const saved = await isQuestSaved(questId);
                setIsSaved(saved);
            } catch (error) {
                console.error('Error checking if quest is saved:', error);
            }
        };

        checkIfSaved();
    }, [questId]);

    const handleSaveQuest = async (event) => {
        event.stopPropagation();
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            await saveQuest(questId);
            setIsSaved(true);
            if (onSave) {
                onSave(questId);
            }
        } catch (error) {
            console.error('Error saving quest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleSaveQuest} 
            disabled={isLoading || isSaved} 
            className={`btn ${isSaved ? 'btn-dark text-white' : 'btn-outline-dark'} mt-auto uniform-width ${styles.saveButton}`}
        >
            {isLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save Quest'}
        </button>
    );
};

export default SaveQuestButton;