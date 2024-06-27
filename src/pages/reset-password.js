import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { resetPassword } from '/services/api';

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [uid, setUid] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            // クエリパラメータを手動でパース
            let query = window.location.search.substring(1);
            query = query.replace(/&amp;/g, '&'); // &amp; を & に置き換える
            query = decodeURIComponent(query); // クエリ文字列をデコード

            const params = new URLSearchParams(query);
            const uidParam = params.get('uid');
            const tokenParam = params.get('token');
            
            console.log('Query Params:', query);
            console.log('UID:', uidParam);
            console.log('Token:', tokenParam);
            
            if (uidParam && tokenParam) {
                setUid(uidParam);
                setToken(tokenParam);
                setMessage('');
            } else {
                console.error('Invalid password reset link - missing uid or token');
                setMessage('Invalid password reset link');
            }
        }
    }, [router.isReady]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            console.log(`Submitting with UID: ${uid}, Token: ${token}`);  // サブミット時のパラメータをログに出力
            const response = await resetPassword(uid, token, newPassword);
            setMessage(response.detail);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                router.push('/login'); // ログインページにリダイレクト
            }, 2000); // 2秒後にリダイレクト
        } catch (error) {
            setMessage('Error resetting password: ' + (error.response ? error.response.data.detail : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            {message && <p>{message}</p>}
            <div>
                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default PasswordReset;