// pages/completed-quests.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCompletedQuests, getProfile, getReports, generateReport } from '/services/api';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from 'components/SearchBar';

const CompletedQuests = () => {
    const [quests, setQuests] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // ロード状態を管理
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

        const fetchCompletedQuests = async () => {
            try {
                const data = await getCompletedQuests();
                setQuests(data);
            } catch (error) {
                console.error('Error fetching completed quests:', error);
                setError('Failed to load completed quests. Please try again later.');
            }
            setLoading(false); // データのフェッチが完了したらロード状態を更新
        };

        checkUserStatus();
        fetchCompletedQuests();
    }, [router]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleComplete = (questId) => {
        setQuests(quests.filter(quest => quest.id !== questId));
    };

    const filteredQuests = quests.filter(quest =>
        quest.quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Completed Quests</title>
            </Head>
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="container mt-5">
                        <h1 className="my-4">Completed Quests</h1>
                        <SearchBar onSearch={handleSearch} />
                        {error && <p className="text-danger">{error}</p>}
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                                {filteredQuests.map(completedQuest => (
                                    <div key={completedQuest.id} className="col mb-5">
                                        <div className="card h-100">
                                            <Image
                                                className="card-img-top"
                                                src={completedQuest.quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
                                                alt={completedQuest.title}
                                                width={450}
                                                height={300}
                                            />
                                            <div className="card-body p-4">
                                                <div className="text-center">
                                                    <h5 className="fw-bolder">{completedQuest.quest.title}</h5>
                                                    {completedQuest.quest.tags && (
                                                        <div>
                                                            {completedQuest.quest.tags.map(tag => (
                                                                <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                                <div className="text-center mb-2">
                                                    <Link href={`/quest/${completedQuest.quest.id}`} legacyBehavior>
                                                        <a className="btn btn-outline-dark mt-auto uniform-width">View Detail</a>
                                                    </Link>
                                                </div>
                                                <div className="text-center">
                                                    <p><b>Completion Date:</b> <br/>{new Date(completedQuest.completion_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default CompletedQuests;