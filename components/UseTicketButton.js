// components/UseTicketButton.js
import { useState } from 'react';
import { useTicket } from '/services/api';

const UseTicketButton = ({ issuanceId, onUse }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUseTicket = async (event) => {
        event.stopPropagation(); // イベントのバブリングを防止
        if (isLoading) return; // リクエストが進行中の場合、再度リクエストを送信しない
        setIsLoading(true);
        try {
            const response = await useTicket(issuanceId);
            if (onUse) {
                onUse(issuanceId); // チケット使用後のコールバックを呼び出す
            }
        } catch (error) {
            console.error('Error using ticket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleUseTicket} disabled={isLoading}>
            {isLoading ? 'Using...' : 'Use Ticket'}
        </button>
    );
};

export default UseTicketButton;
