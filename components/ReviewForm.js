import { useState } from 'react';
import { addQuestReview } from '/services/api';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

const ReactStars = dynamic(() => import('react-rating-stars-component'), { ssr: false });

const ReviewForm = ({ questId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const sanitizedComment = DOMPurify.sanitize(comment);
        setLoading(true);
        try {
            const newReview = await addQuestReview(questId, { rating, comment: sanitizedComment });
            onReviewSubmitted(newReview);
            setRating(1);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-group">
                <textarea
                    className="form-control animated"
                    cols="50"
                    id="new-review"
                    name="comment"
                    placeholder="Enter your review here..."
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                ></textarea>
            </div>
            <div className="text-right">
                <div className="stars starrr" data-rating="0">
                    <ReactStars
                        count={5}
                        onChange={setRating}
                        size={24}
                        activeColor="#ffd700"
                        value={rating}
                        edit={!loading}
                    />
                </div>
                <button className="btn btn-success btn-lg" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

const reviewFormStyles = `
    .animated {
        -webkit-transition: height 0.2s;
        -moz-transition: height 0.2s;
        transition: height 0.2s;
    }

    .stars {
        margin: 20px 0;
        font-size: 24px;
        color: #d17581;
    }
`;

export const ReviewFormWithStyle = ({ questId, onReviewSubmitted }) => (
    <>
        <style>{reviewFormStyles}</style>
        <ReviewForm questId={questId} onReviewSubmitted={onReviewSubmitted} />
    </>
);

export default ReviewForm;