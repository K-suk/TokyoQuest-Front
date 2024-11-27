import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getProfile, useTicket as fetchTicket, getTicketIssuances, getReports, generateReport } from '/services/api';
import Link from 'next/link';
import styles from '../styles/profile.module.css';
import Image from 'next/image'; // 追加

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const checkUserStatus = async () => {
            try {
                const profile = await getProfile();
                const today = new Date().toISOString().split('T')[0];

                if (profile.due && new Date(profile.due) <= new Date(today)) {
                    const reports = await getReports();
                    if (reports.length === 0) {
                        await generateReport();
                    }
                    router.push('/report');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        
        const fetchProfileAndTickets = async () => {
            try {
                const profileData = await getProfile();
                setProfile(profileData);
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

        checkUserStatus();
        if (fetching) {
            fetchProfileAndTickets();
        }
    }, [fetching, router]);

    if (fetching) {
        return <div>Loading...</div>;
    }

    console.log('Tickets:', tickets);

    return (
        <>
            <style jsx global>{`
                body {
                    background: rgb(239, 69, 74);
                }
            `}</style>
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="row">
                    <div className="col">
                        <Image src="/images/Tokyo Quest.png" alt="Tokyo Quest Logo" width={430} height={200} style={{ width: '100%', position: 'relative' }} />
                    </div>
                    <div className="text-white" style={{ position: 'absolute', height: '200px', width: '430px', backgroundColor: 'rgba(0,0,0,0.5)', marginLeft: '20px'}}>
                        <h1 className='pt-4' style={{ fontSize: '36px' }}>{profile.first_name} {profile.last_name}</h1>
                        <p className='pt-2'>{profile.email}</p>
                        <p>You have access to app till {profile.due}</p>
                    </div>
                </div>
                <div className="container">
                    <div className="row text-center mt-4">
                        <div className="col-6 col-md-3 mb-3">
                            <div className="card bg-dark text-white h-100" style={{ aspectRatio: '1 / 1' }}>
                                <Image src="/images/Tokyo Quest.png" alt="Tokyo Quest Logo" width={430} height={200} style={{ width: '100%', position: 'relative', borderRadius: '10px' }} />
                                <div className="card-body" style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0, 0.5)', width: '100%', aspectRatio: '1 / 1', borderRadius: '10px' }}>
                                    <h5 className="card-title">Level</h5>
                                    <p className="card-text" style={{ fontSize: '75px' }}>3</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                            <div className="card bg-dark text-white h-100" style={{ aspectRatio: '1 / 1' }}>
                                <Image src="/images/Tokyo Quest.png" alt="Tokyo Quest Logo" width={430} height={200} style={{ width: '100%', position: 'relative', borderRadius: '10px' }} />
                                <div className="card-body" style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0, 0.5)', width: '100%', aspectRatio: '1 / 1', borderRadius: '10px' }}>
                                    <h5 className="card-title">Completed</h5>
                                    <p className="card-text" style={{ fontSize: '75px' }}>121</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                            <div className="card bg-dark text-white h-100" style={{ aspectRatio: '1 / 1' }}>
                                <Image src="/images/Tokyo Quest.png" alt="Tokyo Quest Logo" width={430} height={200} style={{ width: '100%', position: 'relative', borderRadius: '10px' }} />
                                <div className="card-body" style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0, 0.5)', width: '100%', aspectRatio: '1 / 1', borderRadius: '10px' }}>
                                    <h5 className="card-title">Review Posted</h5>
                                    <p className="card-text" style={{ fontSize: '75px' }}>0</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                            <div className="card bg-dark text-white h-100" style={{ aspectRatio: '1 / 1' }}>
                                <Image src="/images/Tokyo Quest.png" alt="Tokyo Quest Logo" width={430} height={200} style={{ width: '100%', position: 'relative', borderRadius: '10px' }} />
                                <div className="card-body" style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0, 0.5)', width: '100%', aspectRatio: '1 / 1', borderRadius: '10px' }}>
                                    <h5 className="card-title">Quest Saved</h5>
                                    <p className="card-text" style={{ fontSize: '75px' }}>39</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 text-center">
                        <div className="col">
                            <Link href="/edit-profile" passHref>
                                <button className="btn btn-danger btn-lg">Modify User Info</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;