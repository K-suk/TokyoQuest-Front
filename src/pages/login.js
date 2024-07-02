import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '/services/api';
import Link from 'next/link';
import Head from 'next/head';

const Login = () => {
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await login(accountId, password);
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            router.push('/'); // ログイン後にホームページに遷移
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error.message);
        }
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
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <form onSubmit={handleSubmit}>
                                {/* Account ID input */}
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

                                {/* Password input */}
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
                                    {/* Checkbox */}
                                    <Link href="/password-reset-request" legacyBehavior>
                                        <a className="text-body">Forgot password?</a>
                                    </Link>
                                </div>

                                {/* Submit button */}
                                <button type="submit" className="btn btn-primary btn-lg btn-block w-100">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;