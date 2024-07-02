import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getProfile, getTickets, claimTicket, useTicket, getTicketIssuances } from '/services/api';
import ClaimTicketButton from 'components/ClaimTicketButton';
import UseTicketButton from 'components/UseTicketButton';
import Link from 'next/link';
import styles from '../styles/profile.module.css';

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
        <>
            <style jsx global>{`
                body {
                    background: rgb(99, 39, 120);
                }
            `}</style>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
                            <span className="font-weight-bold">{profile.first_name} {profile.last_name}</span>
                            <span className="text-black-50">{profile.email}</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"><label className={`labels ${styles.labels}`}>First Name</label><h3>{profile.first_name}</h3></div>
                                <div className="col-md-6"><label className={`labels ${styles.labels}`}>Last Name</label><h3>{profile.last_name}</h3></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label className={`labels ${styles.labels}`}>Contact Address</label><h3>{profile.contact_address}</h3></div>
                                <div className="col-md-12"><label className={`labels ${styles.labels}`}>Level</label><h3>{profile.level}</h3></div>
                                <div className="col-md-12"><label className={`labels ${styles.labels}`}>Due</label><h3>{profile.due}</h3></div>
                            </div>
                            <Link href="/edit-profile">
                                <div className="mt-5 text-center"><button className={`btn btn-primary profile-button ${styles.profileButton}`} type="button">Edit Profile</button></div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center experience"><span>Tickets</span></div><br />
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
                                                <button className='btn btn-outline-dark mt-auto uniform-width'>Used</button>
                                            )
                                        ) : (
                                            profile.level < ticket.level ? (
                                                <button className='btn btn-outline-dark mt-auto uniform-width'>Level {ticket.level} to claim</button>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;