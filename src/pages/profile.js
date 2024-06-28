import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getProfile, getTickets, claimTicket, useTicket, getTicketIssuances } from '/services/api';
import ClaimTicketButton from 'components/ClaimTicketButton';
import UseTicketButton from 'components/UseTicketButton';
import LogoutButton from 'components/LogoutButton';
import Link from 'next/link';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfileAndTickets = async () => {
            console.log('Fetching profile and tickets...');
            try {
                const profileData = await getProfile();
                console.log('Profile data fetched:', profileData);
                setProfile(profileData);

                const ticketsData = await getTickets();
                console.log('Tickets data fetched:', ticketsData);
                
                // 各チケットに対して TicketIssuance データを追加
                const ticketsWithIssuances = await Promise.all(ticketsData.map(async (ticket) => {
                    const issuances = await getTicketIssuances(ticket.id);
                    return { ...ticket, issuances };
                }));
                setTickets(ticketsWithIssuances);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setFetching(false);
            }
        };

        if (fetching) {
            fetchProfileAndTickets();
        }
    }, [fetching, router]);

    const handleClaimTicket = useCallback((ticketId) => {
        setFetching(true);
    }, []);

    const handleUseTicket = useCallback(async (issuanceId) => {
        try {
            await useTicket(issuanceId);
            setTickets(prevTickets => prevTickets.map(ticket => ({
                ...ticket,
                issuances: ticket.issuances.map(issuance => 
                    issuance.id === issuanceId ? { ...issuance, used: true } : issuance
                )
            })));
            setMessage(`Ticket ${issuanceId} used successfully.`);
        } catch (error) {
            console.error('Error using ticket:', error);
            setMessage(`Error using ticket: ${error.response ? error.response.data.status : error.message}`);
        }
    }, []);

    if (fetching) {
        return <div>Loading...</div>;
    }

    console.log('Tickets:', tickets);

    return (
        <div>
            <h1>Profile</h1>
            {message && <p>{message}</p>}
            <p><strong>Account ID:</strong> {profile.account_id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>First Name:</strong> {profile.first_name}</p>
            <p><strong>Last Name:</strong> {profile.last_name}</p>
            <p><strong>Contact Address:</strong> {profile.contact_address}</p>
            <p><strong>Level:</strong> {profile.level}</p>
            <p><strong>Done:</strong> {profile.done ? 'Yes' : 'No'}</p>
            <p><strong>Due:</strong> {profile.due}</p>
            <LogoutButton />
            <Link href="/edit-profile">
                <p>Edit Profile</p>
            </Link>
            <br />
            <Link href="/change-password">
                <p>Change Password</p>
            </Link>
            <br />
            <Link href="/">
                <p>Back to Home</p>
            </Link>

            <h2>Available Tickets</h2>
            {tickets.map(ticket => {
                console.log(`Checking issued_to for ticket ${ticket.id}:`, ticket.issued_to);
                const claimedTicket = ticket.issued_to.some(user => user.id === profile.id);
                const issuance = ticket.issuances ? ticket.issuances.find(issuance => issuance.user.id === profile.id) : null;
                
                console.log(`Issuance for ticket ${ticket.id}:`, issuance);

                return (
                    <div key={ticket.id}>
                        <p><strong>Ticket:</strong> {ticket.title}</p>
                        <p>{ticket.description}</p>
                        {claimedTicket ? (
                            issuance && !issuance.used ? (
                                <UseTicketButton 
                                    issuanceId={issuance.id} 
                                    onUse={handleUseTicket} 
                                />
                            ) : (
                                <p>Used</p>
                            )
                        ) : (
                            profile.level < ticket.level ? (
                                <p>Level {ticket.level} to claim</p>
                            ) : (
                                <ClaimTicketButton 
                                    ticketId={ticket.id} 
                                    onClaim={handleClaimTicket} 
                                />
                            )
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Profile;