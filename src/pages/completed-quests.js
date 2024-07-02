// pages/completed-quests.js
import { useEffect, useState } from 'react';
import { getCompletedQuests } from '/services/api';
import Head from 'next/head';
import Link from 'next/link';
import SearchBar from 'components/SearchBar'; // Adjust the import path as necessary
import CompleteQuestButton from 'components/CompleteQuestButton'; // Adjust the import path as necessary

const CompletedQuests = () => {
    const [quests, setQuests] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCompletedQuests = async () => {
            try {
                const data = await getCompletedQuests();
                setQuests(data);
            } catch (error) {
                console.error('Error fetching completed quests:', error);
                setError('Failed to load completed quests. Please try again later.');
            }
        };

        fetchCompletedQuests();
    }, []);

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
                        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                            {filteredQuests.map(completedQuest => (
                                <div key={completedQuest.id} className="col mb-5">
                                    <div className="card h-100">
                                        <img className="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
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
                    </div>
                </div>
            </section>
        </>
    );
};

export default CompletedQuests;