// pages/saved-quests.js
import { useEffect, useState } from 'react';
import { getSavedQuests, getCompletedQuests } from '/services/api';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from 'components/SearchBar';
import CompleteQuestButton from '/components/CompleteQuestButton'; // Import the CompleteQuestButton

const SavedQuestsPage = () => {
    const [quests, setQuests] = useState([]);
    const [completedQuests, setCompletedQuests] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        const fetchQuests = async () => {
            try {
                const savedQuestsData = await getSavedQuests();
                const completedQuestsData = await getCompletedQuests();
                setCompletedQuests(completedQuestsData.map(q => q.quest.id));
                const filteredQuests = savedQuestsData.filter(savedQuest => 
                    !completedQuestsData.some(completedQuest => completedQuest.quest.id === savedQuest.quest.id)
                );
                setQuests(filteredQuests);
            } catch (error) {
                console.error('Error fetching quests:', error);
                setError('Failed to load quests. Please try again later.');
            }
        };

        fetchQuests();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleComplete = (questId) => {
        setQuests(quests.filter(savedQuest => savedQuest.quest.id !== questId));
    };

    const filteredQuests = quests.filter(savedQuest =>
        savedQuest.quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Saved Quests</title>
            </Head>
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="container mt-5">
                        <h1 className="my-4">Saved Quests</h1>
                        <SearchBar onSearch={handleSearch} />
                        {error && <p className="text-danger">{error}</p>}
                        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                            {filteredQuests.map(savedQuest => (
                                <div key={savedQuest.id} className="col mb-5">
                                    <div className="card h-100">
                                        <Image
                                            className="card-img-top"
                                            src={savedQuest.quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
                                            alt={savedQuest.quest.title}
                                            width={450}
                                            height={300}
                                        />
                                        <div className="card-body p-4">
                                            <div className="text-center">
                                                <h5 className="fw-bolder">{savedQuest.quest.title}</h5>
                                                {savedQuest.quest.tags && (
                                                    <div>
                                                        {savedQuest.quest.tags.map(tag => (
                                                            <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                            <div className="text-center mb-2">
                                                <Link href={`/quest/${savedQuest.quest.id}`} legacyBehavior>
                                                    <a className="btn btn-outline-dark mt-auto uniform-width">View Detail</a>
                                                </Link>
                                            </div>
                                            <div className="text-center">
                                                <CompleteQuestButton questId={savedQuest.quest.id} onComplete={handleComplete} className="uniform-width" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SavedQuestsPage;