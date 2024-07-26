import { useEffect, useState } from 'react';
import { getReports } from '/services/api';
import Head from 'next/head';
import LogoutButton from '/components/LogoutButton';

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');

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
    }, []);

    return (
        <>
            <Head>
                <title>Reports</title>
                <style>
                    {`
                        .report-container {
                            color: black;
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
            </div>
        </>
    );
};

export default ReportPage;