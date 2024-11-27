import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getQuest, getQuestReviews, addQuestReview } from '/services/api';
import Head from 'next/head';
import styles from 'src/styles/questDetail.module.css';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import CompleteQuestButton from '/components/CompleteQuestButton';
import SaveQuestButton from '/components/SaveQuestButton';

const QuestDetail = () => {
    const [quest, setQuest] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
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

                if (reviewsData.length > 0) {
                    const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
                    const avgRating = totalRating / reviewsData.length;
                    setAverageRating(avgRating);
                }
            } catch (error) {
                console.error('Error fetching quest or reviews:', error);
            }
        };

        fetchQuestAndReviews();
    }, [id]);

    const handleReviewSubmitted = async () => {
        if (!newReview.comment || newReview.rating === 0) {
            alert('Please provide both a comment and a rating.');
            return;
        }

        setIsSubmitting(true);

        try {
            const createdReview = await addQuestReview(id, newReview);
            setReviews([...reviews, createdReview]);
            const newTotalRating = reviews.reduce((acc, review) => acc + review.rating, 0) + newReview.rating;
            const newAvgRating = newTotalRating / (reviews.length + 1);
            setAverageRating(newAvgRating);

            setNewReview({ comment: '', rating: 0 });
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!quest) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{quest.title}</title>
            </Head>
            <div className={styles.body}>
                <div className="container mt-4">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <button className="btn text-black" onClick={() => router.back()} style={{ borderRadius: "50%" }}>
                                く
                            </button>
                        </div>
                        <div className="col-10 d-flex justify-content-end align-items-center">
                            <span className="text-warning me-2">
                                {"★".repeat(Math.floor(averageRating)) + "☆".repeat(5 - Math.floor(averageRating))}
                            </span>
                            <span>{averageRating.toFixed(1)}</span>
                            <span className="ms-2">{reviews.length} Reviews</span>
                            <SaveQuestButton questId={id} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <Image
                                src={quest.imgUrl || "https://dummyimage.com/600x400/ddd/000"}
                                alt="Quest Image"
                                width={600}
                                height={300}
                                className="img-fluid rounded"
                            />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <h2>{quest.title}</h2>
                            <p>
                                <b>Budget:</b> {quest.budget || "Free"}
                            </p>
                            <p>
                                <b>Map:</b>{" "}
                                <a href={quest.location || "#"} target="_blank" rel="noopener noreferrer">
                                    {quest.location || "Not Available"}
                                </a>
                            </p>
                            <CompleteQuestButton questId={quest.id} className="uniform-width" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h5>Quest Detail</h5>
                            <p>{quest.description}</p>
                        </div>
                        <div className="col-12">
                            <h5>Only locals know</h5>
                            <p>{quest.tips}</p>
                        </div>
                        <div className="col-12">
                            <h5>Official Web site</h5>
                            <a href={quest.map || "#"} target="_blank" rel="noopener noreferrer">
                                {quest.map || "Not Available"}
                            </a>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <h5>Reviews</h5>
                            {reviews.slice(0, 2).map((review) => (
                                <div key={review.id} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <span className="text-warning me-2">
                                            {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                                        </span>
                                        <span className="me-3">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p>{DOMPurify.sanitize(review.comment)}</p>
                                </div>
                            ))}
                            <button className="btn btn-outline-danger w-100">More Reviews</button>
                        </div>
                    </div>

                    <div className="row mt-4 mb-4">
                        <div className="col-12">
                            <h5>Leave Review</h5>
                            <textarea
                                className="form-control mb-3"
                                placeholder="Tell us about your experience!"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            ></textarea>
                            <div className="d-flex align-items-center mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`btn btn-${newReview.rating >= star ? 'warning' : 'secondary'} me-1`}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <button
                                className="btn btn-danger"
                                onClick={handleReviewSubmitted}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestDetail;