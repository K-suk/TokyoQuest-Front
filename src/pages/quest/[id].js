import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getQuest, getQuestReviews } from '/services/api';
import { ReviewFormWithStyle } from 'components/ReviewForm';
import Head from 'next/head';
import styles from 'src/styles/questDetail.module.css';
import DOMPurify from 'dompurify';
import Image from 'next/image';

const QuestDetail = () => {
    const [quest, setQuest] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
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

    const handleReviewSubmitted = (newReview) => {
        setReviews([...reviews, newReview]);
        const newTotalRating = reviews.reduce((acc, review) => acc + review.rating, 0) + newReview.rating;
        const newAvgRating = newTotalRating / (reviews.length + 1);
        setAverageRating(newAvgRating);
    };

    if (!quest) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
                    integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
                    crossOrigin="anonymous"
                />
            </Head>
            <style jsx>{`
                body {
                    margin-top: 20px;
                    background: #eee;
                }
                .review-list ul li .left span {
                    width: 32px;
                    height: 32px;
                    display: inline-block;
                }
                .review-list ul li .left {
                    flex: none;
                    max-width: none;
                    margin: 0 10px 0 0;
                }
                .review-list ul li .left span img {
                    border-radius: 50%;
                }
                .review-list ul li .right h4 {
                    font-size: 16px;
                    margin: 0;
                    display: flex;
                }
                .review-list ul li .right h4 .gig-rating {
                    display: flex;
                    align-items: center;
                    margin-left: 10px;
                    color: #ffbf00;
                }
                .review-list ul li .right h4 .gig-rating svg {
                    margin: 0 4px 0 0px;
                }
                .country .country-flag {
                    width: 16px;
                    height: 16px;
                    vertical-align: text-bottom;
                    margin: 0 7px 0 0px;
                    border: 1px solid #fff;
                    border-radius: 50px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                .country .country-name {
                    color: #95979d;
                    font-size: 13px;
                    font-weight: 600;
                }
                .review-list ul li {
                    border-bottom: 1px solid #dadbdd;
                    padding: 0 0 30px;
                    margin: 0 0 30px;
                }
                .review-list ul li .right {
                    flex: auto;
                }
                .review-list ul li .review-description {
                    margin: 20px 0 0;
                }
                .review-list ul li .review-description p {
                    font-size: 14px;
                    margin: 0;
                }
                .review-list ul li .publish {
                    font-size: 13px;
                    color: #95979d;
                }
                .review-section h4 {
                    font-size: 20px;
                    color: #222325;
                    font-weight: 700;
                }
                .review-section .stars-counters tr .stars-filter.fit-button {
                    padding: 6px;
                    border: none;
                    color: #4a73e8;
                    text-align: left;
                }
                .review-section .fit-progressbar-bar .fit-progressbar-background {
                    position: relative;
                    height: 8px;
                    background: #efeff0;
                    -webkit-box-flex: 1;
                    -ms-flex-positive: 1;
                    flex-grow: 1;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                    background-color: #ffffff;
                    border-radius: 999px;
                }
                .review-section .stars-counters tr .star-progress-bar .progress-fill {
                    background-color: #ffb33e;
                }
                .review-section .fit-progressbar-bar .progress-fill {
                    background: #2cdd9b;
                    background-color: rgb(29, 191, 115);
                    height: 100%;
                    position: absolute;
                    left: 0;
                    z-index: 1;
                    border-radius: 999px;
                }
                .review-section .fit-progressbar-bar {
                    display: flex;
                    align-items: center;
                }
                .review-section .stars-counters td {
                    white-space: nowrap;
                }
                .review-section .stars-counters tr .progress-bar-container {
                    width: 100%;
                    padding: 0 10px 0 6px;
                    margin: auto;
                }
                .ranking h6 {
                    font-weight: 600;
                    padding-bottom: 16px;
                }
                .ranking li {
                    display: flex;
                    justify-content: space-between;
                    color: #95979d;
                    padding-bottom: 8px;
                }
                .review-section .stars-counters td.star-num {
                    color: #4a73e8;
                }
                .ranking li>span {
                    color: #62646a;
                    white-space: nowrap;
                    margin-left: 12px;
                }
                .review-section {
                    border-bottom: 1px solid #dadbdd;
                    padding-bottom: 24px;
                    margin-bottom: 34px;
                    padding-top: 64px;
                }
                .review-section select, .review-section .select2-container {
                    width: 188px !important;
                    border-radius: 3px;
                }
                ul, ul li {
                    list-style: none;
                    margin: 0px;
                }
                .helpful-thumbs, .helpful-thumb {
                    display: flex;
                    align-items: center;
                    font-weight: 700;
                }

                /* 追加: 画像のスタイル */
                .quest-image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                }

                .quest-image {
                    width: 80%;
                    height: auto;
                    max-width: 100%;
                    border-radius: 12px;
                }
            `}</style>
            <div className={styles.body}>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-12 quest-image-container"> {/* 変更: col-md-5からcol-md-12に変更 */}
                            <Image
                                src={quest.imgUrl || "https://www.bootdey.com/image/400x300/FFB6C1/000000"}
                                alt="project-image"
                                className="rounded quest-image" // 変更: クラス名を追加
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="col-md-7">
                            <div className={`${styles["project-info-box"]} mt-0`}>
                                <h2>QUEST DETAILS</h2>
                                <p className="mb-0 content-p mb-2">{quest.description}</p>
                                <h2>Only Local knows</h2>
                                <p className="mb-0 content-p">{quest.tips}</p>
                            </div>
                            <div className={`${styles["project-info-box"]} mt-0`}>
                                <p className='content-p'><b>Title:</b> {quest.title}</p>
                                <p className='content-p'><b>Avg review:</b> {averageRating.toFixed(1)}</p>
                                <p className='content-p'>
                                    <b>Location:</b> <a href={quest.location} target="_blank" rel="noopener noreferrer">{quest.location}</a>
                                </p>
                                <p className="mb-0 content-p"><b>Budget:</b> {quest.badget}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 mb-4">
                        <div className='col-md-5'>
                            <h2>Leave Review</h2>
                            <ReviewFormWithStyle questId={id} onReviewSubmitted={handleReviewSubmitted} />
                        </div>
                        <div className="col-md-7">
                            <h2>Reviews</h2>
                            <div className="review-list">
                                <ul>
                                    {reviews.map(review => (
                                        <li key={review.id}>
                                            <div className="d-flex">
                                                <div className="right">
                                                    <h4>
                                                    {review.user.first_name} {review.user.last_name}
                                                        <span className="gig-rating text-body-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" width="15" height="15">
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z"
                                                                ></path>
                                                            </svg>
                                                            {review.rating}
                                                        </span>
                                                    </h4>
                                                    <div className="review-description">
                                                        <p>{DOMPurify.sanitize(review.comment)}</p>
                                                    </div>
                                                    <span className="publish py-3 d-inline-block w-100">Published {new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestDetail;