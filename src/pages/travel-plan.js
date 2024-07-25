// pages/travel-plan.js
import React, { useState, useEffect } from 'react';
import { createTravelPlan, getUserTravelPlan } from '/services/api';
import styles from 'src/styles/TravelPlan.module.css';
import Image from 'next/image';
import Link from 'next/link';
import CompleteQuestButton from 'components/CompleteQuestButton.js';
import SaveQuestButton from 'components/SaveQuestButton.js';  // SaveQuestButtonのインポート

const TravelPlanPage = () => {
    const [area, setArea] = useState('');
    const [tag, setTag] = useState('');
    const [message, setMessage] = useState('');
    const [quests, setQuests] = useState([]);
    const [planExists, setPlanExists] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserTravelPlan();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await createTravelPlan(area);
            setMessage('Travel plan created successfully!');
            await fetchUserTravelPlan();
        } catch (error) {
            setMessage('Error creating travel plan. Please try again.');
        }
        setLoading(false);
    };

    const fetchUserTravelPlan = async () => {
        setLoading(true);
        try {
            const plan = await getUserTravelPlan();
            if (plan) {
                setQuests(plan.quests);
                setPlanExists(true);
            } else {
                setPlanExists(false);
            }
        } catch (error) {
            setMessage('Error fetching travel plan.');
            setPlanExists(false);
        }
        setLoading(false);
    };

    const handleComplete = async (questId) => {
        // クエスト完了処理のロジックをここに追加
    };

    const handleSave = async (questId) => {
        // クエスト保存成功後の処理をここに追加
    };

    return (
        <div className={styles.travelPlanContainer}>
            <h1 className={styles.title}>Create Travel Plan</h1>
            <form onSubmit={handleSubmit} className={styles.travelPlanForm}>
                <div className={styles.formGroup}>
                    <label>
                        Area:
                        <select
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select an area</option>
                            <option value="shibuya">Shibuya</option>
                            <option value="asakusa">Asakusa</option>
                            <option value="tokyo">Tokyo</option>
                            <option value="odaiba">Odaiba</option>
                        </select>
                    </label>
                </div>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Loading...' : 'Create Plan'}
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            <h1 className={styles.title}>Your Travel Plan</h1>
            {loading ? (
                <div className={styles.loadingSpinner}>Loading...</div>
            ) : planExists ? (
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
            ) : (
                <p>Travel Plan Not Exist</p>
            )}
        </div>
    );
};

export default TravelPlanPage;