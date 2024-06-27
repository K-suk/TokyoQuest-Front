import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '/services/api';
import Link from 'next/link';

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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Account ID"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            <br />
            <Link href="/password-reset-request">
                <p>Forgot Password?</p>
            </Link>
        </form>
    );
};

export default Login;