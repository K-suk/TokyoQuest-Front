import React, { useEffect, useState } from 'react';
import Map from '/components/Map';
import QuestCard from '/components/QuestCard';
import { getIncompleteQuests } from '/services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuestsMapPage = () => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const data = await getIncompleteQuests();
                setQuests(data);
            } catch (error) {
                console.error('Error fetching quests:', error);
            }
        };

        fetchQuests();
    }, []);

    const handleMarkerClick = (quest) => {
        setSelectedQuest(quest);
    };

    const handleComplete = (questId) => {
        // 完了ボタンがクリックされたときの処理を追加
    };

    const handleSave = (questId) => {
        // 保存ボタンがクリックされたときの処理を追加
    };

    const handleCardClose = () => {
        setSelectedQuest(null);
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <Map quests={quests} onMarkerClick={handleMarkerClick} />
            {selectedQuest && (
                <div className="questCardContainer" style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    zIndex: '1000',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <QuestCard quest={selectedQuest} handleComplete={handleComplete} handleSave={handleSave} onClose={handleCardClose} />
                </div>
            )}
        </div>
    );
};

export default QuestsMapPage;