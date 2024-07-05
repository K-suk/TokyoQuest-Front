// components/UseTicketButton.js
import { useState } from 'react';
import { useTicket as fetchTicket } from '/services/api';

const UseTicketButton = ({ issuanceId, onUse }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUseTicket = async (event) => {
        event.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);
        try {
            await fetchTicket(issuanceId); // ここでエイリアスを使用
            if (onUse) {
                onUse(issuanceId);
            }
        } catch (error) {
            console.error('Error using ticket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleUseTicket} disabled={isLoading} className="btn btn-outline-dark mt-auto uniform-width">
            {isLoading ? 'Using...' : 'Use Ticket'}
        </button>
    );
};

export default UseTicketButton;