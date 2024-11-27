import { useState } from 'react';
import { requestPasswordReset } from '/services/api';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.detail);
            setEmail('');
        } catch (error) {
            setMessage('Error requesting password reset: ' + (error.response ? error.response.data.detail : error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            backgroundImage: 'url(/images/login.png)', // 背景画像のパスを設定
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div>
                <div className="card-header text-white">
                    <h3 className="mb-0">Password Reset</h3>
                </div>
                <div className="card-body">
                    <form className="form" role="form" autoComplete="off" onSubmit={handleSubmit}>
                        {message && <p className={message.includes('Error') ? 'text-danger' : 'text-success'}>{message}</p>}
                        <div className="form-group">
                            <label htmlFor="resetEmail">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="resetEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span id="helpResetPasswordEmail" className="form-text small text-white">
                                Password reset instructions will be sent to this email address.
                            </span>
                        </div>
                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-lg float-right" disabled={isSubmitting} style={{ backgroundColor: '#EF454A', color: '#fff' }}>
                                {isSubmitting ? 'Sending...' : 'Reset'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequest;