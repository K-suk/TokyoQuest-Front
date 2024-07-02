import { useState } from 'react';
import { useRouter } from 'next/router';
import { changePassword } from '/services/api';

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
        <div className="col-md-6 offset-md-3 mt-4">
            <div className="card card-outline-secondary">
                <div className="card-header">
                    <h3 className="mb-0">Change Password</h3>
                </div>
                <div className="card-body">
                    <form className="form" role="form" autoComplete="off" onSubmit={handleSubmit}>
                        {error && <p className="text-danger">{error}</p>}
                        {success && <p className="text-success">{success}</p>}
                        <div className="form-group mt-2">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <span className="form-text small text-muted">
                                The password must be 8-20 characters, and must <em>not</em> contain spaces.
                            </span>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="confirmPassword">Verify</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="form-text small text-muted">
                                To confirm, type the new password again.
                            </span>
                        </div>
                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-success btn-lg float-right">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;