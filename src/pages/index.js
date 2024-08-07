// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getIncompleteQuests, searchQuestsByTag, getProfile, getReports, generateReport } from '/services/api'; // 必要な関数をインポート
import CompleteQuestButton from '/components/CompleteQuestButton';
import SaveQuestButton from '/components/SaveQuestButton'; // SaveQuestButtonをインポート
import Link from 'next/link';
import SearchBar from '/components/SearchBar';
import Head from 'next/head';
import Image from 'next/image';
import MediaUploadModal from '/components/MediaUploadModal';
import styles from 'src/styles/Home.module.css'; // CSSモジュールのインポート

const Home = ({ initialQuests }) => {
    const [quests, setQuests] = useState(initialQuests);
    const [showModal, setShowModal] = useState(false);
    const [currentQuestId, setCurrentQuestId] = useState(null);
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

        const fetchData = async () => {
            try {
                const questsData = await getIncompleteQuests();
                setQuests(questsData);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    router.push('/login');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
            setLoading(false); // データのフェッチが完了したらロード状態を更新
        };

        checkUserStatus();
        fetchData();
    }, [router]);

    const handleComplete = (questId) => {
        setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== questId));
    };

    const handleSave = (questId) => {
        console.log(`Quest ${questId} saved.`);
    };

    const handleSearch = async (tag) => {
        try {
            const results = await searchQuestsByTag(tag);
            setQuests(results);
        } catch (error) {
            console.error('Error searching quests:', error);
        }
    };

    const handleOpenModal = (questId) => {
        setCurrentQuestId(questId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentQuestId(null);
    };

    return (
        <div>
            <Head>
                <title>Shop Homepage - Start Bootstrap Template</title>
                <link rel="icon" href="/assets/favicon.ico" />
            </Head>
            <header className={`${styles.header} position-relative`}>
                <Image
                    src="/images/Tokyo Quest.png"
                    alt="Tokyo Quest"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </header>
            <section>
                <div className="container px-4 px-lg-5">
                    <div className="container mt-5">
                        <h1 className="my-4">Quests</h1>
                        <SearchBar onSearch={handleSearch} />
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                                {quests.map(quest => (
                                    <div key={quest.id} className="col mb-5">
                                        <div className="card h-100">
                                            <Image
                                                className="card-img-top"
                                                src={quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
                                                alt={quest.title}
                                                width={450}
                                                height={300}
                                            />
                                            <div className="card-body p-4">
                                                <div className="text-center">
                                                    <h5 className="fw-bolder">{quest.title}</h5>
                                                    {quest.tags && (
                                                        <div>
                                                            {quest.tags.map(tag => (
                                                                <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                                <div className="text-center mb-2">
                                                    <Link href={`/quest/${quest.id}`} legacyBehavior>
                                                        <a className="btn btn-outline-dark mt-auto uniform-width">View Detail</a>
                                                    </Link>
                                                </div>
                                                <div className="text-center mb-2">
                                                    <CompleteQuestButton questId={quest.id} onComplete={handleComplete} className="uniform-width" />
                                                </div>
                                                <div className="text-center">
                                                    <SaveQuestButton questId={quest.id} onSave={handleSave} />
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
            {showModal && <MediaUploadModal questId={currentQuestId} onComplete={handleComplete} onClose={handleCloseModal} />}
        </div>
    );
};

export const getServerSideProps = async () => {
    try {
        const initialQuests = await getIncompleteQuests();
        return {
            props: {
                initialQuests
            }
        };
    } catch (error) {
        return {
            props: {
                initialQuests: []
            }
        };
    }
};

export default Home;