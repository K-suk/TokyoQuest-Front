import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '/services/api';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const Login = () => {
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading状態を追加
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Loadingを開始
        try {
            const data = await login(accountId, password);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            router.push('/'); // ログイン後にホームページに遷移
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error.message);
            setError('Invalid account ID or password. Please try again.');
        }
        setLoading(false); // Loadingを終了
    };

    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <Image
                                src="/images/Untitled design (3).png"
                                className="img-fluid"
                                alt="Phone image"
                                width={500}
                                height={500}
                                style={{ width: '500px', height: '500px' }}
                            />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <h1 className="mb-4">Login</h1>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="form1Example13"
                                        className="form-control form-control-lg"
                                        value={accountId}
                                        onChange={(e) => setAccountId(e.target.value)}
                                        placeholder="Enter your account ID"
                                        required
                                    />
                                </div>

                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        id="form1Example23"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-end align-items-center mb-4">
                                    <Link href="/password-reset-request" legacyBehavior>
                                        <a className="text-body">Forgot password?</a>
                                    </Link>
                                </div>

                                <button type="submit" className="btn btn-lg btn-block w-100" style={{ backgroundColor: '#EF454A', color: '#fff' }} disabled={loading}>
                                    {loading ? 'Loading...' : 'Log in'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;