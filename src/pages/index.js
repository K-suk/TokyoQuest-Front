import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getIncompleteQuests } from '/services/api';
import CompleteQuestButton from '/components/CompleteQuestButton';
import LogoutButton from 'components/LogoutButton';
import Link from 'next/link';

const Home = ({ initialQuests }) => {
    const [quests, setQuests] = useState(initialQuests);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login'); // トークンがない場合はログインページにリダイレクト
            return;
        }

        const fetchData = async () => {
            try {
                const questsData = await getIncompleteQuests();
                setQuests(questsData);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // トークンが無効な場合もログインページにリダイレクト
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    router.push('/login');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, []);

    const handleComplete = (questId) => {
        setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== questId));
    };

    return (
        <div>
            <h1>Quests</h1>
            <ul>
                {quests.map(quest => (
                    <li key={quest.id}>
                        {quest.title}
                        <CompleteQuestButton questId={quest.id} onComplete={handleComplete} />
                    </li>
                ))}
            </ul>
            <LogoutButton />
            <Link href="/profile">
                <p>Go to Profile</p>
            </Link>
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