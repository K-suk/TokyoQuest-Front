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
import Script from 'next/script';

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

    useEffect(() => {
        console.log("work");
        const titles = document.querySelectorAll(".quest-title");
        const maxLength = 40; // 半角50文字 (全角は約25文字)

        titles.forEach(title => {
            const text = title.textContent;
            if (text.length > maxLength) {
                title.textContent = text.substring(0, maxLength) + "…";
            }
        });
    }, [quests]);

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
                <title>TokyoQuest</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            {/* カテゴリ */}
            <div className="container mt-4">
                <h3>Famous Categories</h3>
                <div className="row">
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Night Life" width={70} height={70} className="rounded-circle" />
                        <p>Night Life</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Shibuya Area" width={70} height={70} className="rounded-circle" />
                        <p>Shibuya</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Shinjuku" width={70} height={70} className="rounded-circle" />
                        <p>Shinjuku</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Food" width={70} height={70} className="rounded-circle" />
                        <p>Food</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Night Life" width={70} height={70} className="rounded-circle" />
                        <p>Night Life</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Shibuya Area" width={70} height={70} className="rounded-circle" />
                        <p>Shibuya</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Shinjuku" width={70} height={70} className="rounded-circle" />
                        <p>Shinjuku</p>
                    </div>
                    <div className="col-3 text-center category-icon">
                        <Image src="/images/Tokyo Quest.png" alt="Food" width={70} height={70} className="rounded-circle" />
                        <p>Food</p>
                    </div>
                </div>

                <h3>Shibuya Quests</h3>
                <ul className="scroll_content" style={{ display: 'flex', maxWidth: '2000px', marginLeft: '-45px', overflowX: 'auto', marginBottom: '-10px' }}>
                    {quests.map((quest) => (
                        <li
                            style={{
                                width: '60%',
                                padding: '8px',
                                margin: '3px',
                                flexShrink: '0',
                                listStyle: 'none',
                                cursor: 'pointer',
                            }}
                            key={quest.id}
                        >
                            {/* 画像とタイトル全体をクリック可能にする */}
                            <Link href={`/quest/${quest.id}`} legacyBehavior>
                                <a
                                    style={{
                                        textDecoration: 'none', // リンクのデフォルト装飾を削除
                                        color: 'inherit', // テキスト色を継承
                                        display: 'block', // 全体をリンクとして機能させる
                                    }}
                                >
                                    {/* 画像 */}
                                    <img
                                        src={quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '5px',
                                            borderTopRightRadius: '5px',
                                            opacity: '0.8',
                                        }}
                                        alt={quest.title}
                                    />
                                    {/* タイトル */}
                                    <p
                                        className="quest-title"
                                        style={{
                                            backgroundColor: '#EF454A',
                                            color: 'white',
                                            height: '105px',
                                            borderBottomLeftRadius: '5px',
                                            borderBottomRightRadius: '5px',
                                            padding: '10px',
                                            fontWeight: 'bold',
                                            fontSize: '20px',
                                        }}
                                    >
                                        {quest.title}
                                    </p>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>

                <h3>Shinjuku Quests</h3>
                <ul className="scroll_content" style={{ display: 'flex', maxWidth: '2000px', marginLeft: '-45px', overflowX: 'auto', marginBottom: '-10px' }}>
                    {quests.map((quest) => (
                        <li
                            style={{
                                width: '60%',
                                padding: '8px',
                                margin: '3px',
                                flexShrink: '0',
                                listStyle: 'none',
                                cursor: 'pointer',
                            }}
                            key={quest.id}
                        >
                            {/* 画像とタイトル全体をクリック可能にする */}
                            <Link href={`/quest/${quest.id}`} legacyBehavior>
                                <a
                                    style={{
                                        textDecoration: 'none', // リンクのデフォルト装飾を削除
                                        color: 'inherit', // テキスト色を継承
                                        display: 'block', // 全体をリンクとして機能させる
                                    }}
                                >
                                    {/* 画像 */}
                                    <img
                                        src={quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '5px',
                                            borderTopRightRadius: '5px',
                                            opacity: '0.8',
                                        }}
                                        alt={quest.title}
                                    />
                                    {/* タイトル */}
                                    <p
                                        className="quest-title"
                                        style={{
                                            backgroundColor: '#EF454A',
                                            color: 'white',
                                            height: '105px',
                                            borderBottomLeftRadius: '5px',
                                            borderBottomRightRadius: '5px',
                                            padding: '10px',
                                            fontWeight: 'bold',
                                            fontSize: '20px',
                                        }}
                                    >
                                        {quest.title}
                                    </p>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bootstrap JS Script */}
            {/* <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></Script> */}
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