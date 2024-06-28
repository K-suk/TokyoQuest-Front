import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getQuest, getQuestReviews } from '/services/api';
import ReviewForm from 'components/ReviewForm';

const QuestDetail = () => {
    const [quest, setQuest] = useState(null);
    const [reviews, setReviews] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchQuestAndReviews = async () => {
            if (!id) return;

            try {
                const questData = await getQuest(id);
                setQuest(questData);

                const reviewsData = await getQuestReviews(id);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching quest or reviews:', error);
            }
        };

        fetchQuestAndReviews();
    }, [id]);

    const handleReviewSubmitted = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    if (!quest) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{quest.title}</h1>
            <p>{quest.description}</p>
            <h2>Reviews</h2>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p><strong>{review.user.first_name} {review.user.last_name}</strong>: {review.comment}</p>
                        <p>Rating: {review.rating}</p>
                    </li>
                ))}
            </ul>
            <ReviewForm questId={id} onReviewSubmitted={handleReviewSubmitted} />
        </div>
    );
};

export default QuestDetail;