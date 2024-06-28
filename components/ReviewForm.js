import { useState } from 'react';
import { addQuestReview } from '/services/api';

const ReviewForm = ({ questId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newReview = await addQuestReview(questId, { rating, comment });
            onReviewSubmitted(newReview);
            setRating(1);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="rating">Rating:</label>
                <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="comment">Comment:</label>
                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;