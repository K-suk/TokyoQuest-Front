// components/ClaimTicketButton.js
import { useState } from 'react';
import { claimTicket } from '/services/api';

const ClaimTicketButton = ({ ticketId, onClaim }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClaimTicket = async (event) => {
        event.stopPropagation(); // イベントのバブリングを防止
        if (isLoading) return; // リクエストが進行中の場合、再度リクエストを送信しない
        setIsLoading(true);
        try {
            const response = await claimTicket(ticketId);
            if (onClaim) {
                onClaim(ticketId); // チケット請求後のコールバックを呼び出す
            }
        } catch (error) {
            console.error('Error claiming ticket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleClaimTicket} disabled={isLoading} className="btn btn-outline-dark mt-auto uniform-width">
            {isLoading ? 'Claiming...' : 'Claim Ticket'}
        </button>
    );
};

export default ClaimTicketButton;
