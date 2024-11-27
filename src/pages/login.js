import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '/services/api';
import Link from 'next/link';
import Head from 'next/head';

const Login = () => {
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await login(accountId, password);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            router.push('/'); // ログイン後にホームページに遷移
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error.message);
            setError('Invalid account ID or password. Please try again.');
        }
        setLoading(false);
    };

    return (
        <>
            <div
                style={{
                    height: '100vh',
                    backgroundImage: 'url(/images/login.png)', // 背景画像のパスを設定
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className='text-white text-center'>
                    <img
                        src="/images/logoRotWeiß.png"
                        className="img-fluid"
                        alt="Phone image"
                        width={500}
                        height={300}
                        style={{ width: '300px', height: '200px', marginTop: '-100px' }}
                    />
                    <h1 style={{ marginBottom: '20px', fontSize: '36px' }}>Welcome back Hero</h1>
                    {error && (
                        <div
                            style={{
                                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                padding: '10px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                border: 'none',
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                border: 'none',
                            }}
                        />
                        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                            <Link href="/password-reset-request" legacyBehavior>
                                <a style={{ color: '#fff', fontSize: '14px' }}>Forgot Password?</a>
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#EF454A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;