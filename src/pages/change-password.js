import { useState } from 'react';
import { useRouter } from 'next/router';
import { changePassword } from '/services/api';
import Link from 'next/link';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await changePassword(currentPassword, newPassword);
            setSuccess(response.detail);
            setError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                router.push('/profile'); // プロフィールページにリダイレクト
            }, 2000); // 2秒後にリダイレクト
        } catch (error) {
            setError('Error changing password: ' + (error.response ? error.response.data.detail : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Change Password</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
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
            <button type="submit">Change Password</button>
            <br />
            <Link href="/profile">
                <p>Back to Profile</p>
            </Link>
        </form>
    );
};

export default ChangePassword;
