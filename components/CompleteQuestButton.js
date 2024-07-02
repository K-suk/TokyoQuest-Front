import { useState } from 'react';
import { completeQuest } from '../services/api';

const CompleteQuestButton = ({ questId, onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCompleteQuest = async (event) => {
        console.log('Button clicked'); // ログを追加
        event.stopPropagation(); // イベントのバブリングを防止
        if (isLoading) return; // リクエストが進行中の場合、再度リクエストを送信しない
        setIsLoading(true);
        try {
            await completeQuest(questId);
            if (onComplete) {
                onComplete(questId); // クエスト完了後のコールバックを呼び出す
            }
        } catch (error) {
            console.error('Error completing quest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleCompleteQuest} disabled={isLoading} className="btn btn-outline-dark mt-auto uniform-width">
            {isLoading ? 'Completing...' : 'Complete Quest'}
        </button>
    );
};

export default CompleteQuestButton;