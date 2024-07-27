// pages/report.js

import { useEffect, useState } from 'react';
import { getReports } from '/services/api';
import Head from 'next/head';
import LogoutButton from '/components/LogoutButton';
import { useRouter } from 'next/router';

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        const fetchReport = async () => {
            try {
                const data = await getReports();
                setReports(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching report:', error);
                setError('Failed to load reports. Please try again later.');
            }
        };

        fetchReport();
    }, [router]);

    return (
        <>
            <Head>
                <title>Reports</title>
                <style>
                    {`
                        .report-container {
                            color: black;
                        }
                        .footnote {
                            font-size: 0.9em;
                            color: #555;
                            border-top: 1px solid #ddd;
                            padding-top: 10px;
                            margin-top: 20px;
                        }
                    `}
                </style>
            </Head>
            <div className="report-container container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Reports</h1>
                    <button className="btn btn-lg" style={{ backgroundColor: '#EF454A'}}><LogoutButton /></button>
                </div>
                {error && <p className="text-danger">{error}</p>}
                <ul className="list-group">
                    {reports.map(report => (
                        <li key={report.id} className="list-group-item">
                            <h5>Report Date: {new Date(report.report_date).toLocaleDateString()}</h5>
                            <p>{report.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="footnote mt-4">
                    <p>Here is your TokyoQuest completion report. Thank you for using TokyoQuest. We hope we were able to make your trip more enjoyable and convenient!</p>
                    <p>If you have any additional photos or videos you would like to include in your memory video, please use the following link to send them to us via WeTransfer:</p>
                    <p><a href="https://wetransfer.com/" target="_blank" rel="noopener noreferrer">https://wetransfer.com/</a></p>
                    <p>Please send them to:</p>
                    <p><strong>miasanmiatokyo@gmail.com</strong></p>
                    <p>Lastly, we would greatly appreciate your feedback on your experience with the TokyoQuest app. If you could assist us by providing your feedback, please do so through the following link:</p>
                    <p><a href="https://docs.google.com/forms/d/e/1FAIpQLScd1ys6PEbjVH7Ud9x-PjZi0yoJkd70Ib76xWY8TzJKr7vQFA/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">Feedback Form</a></p>
                </div>
            </div>
        </>
    );
};

export default ReportPage;