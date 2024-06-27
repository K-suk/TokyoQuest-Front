import { useState } from 'react';
import { requestPasswordReset } from '/services/api';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.detail);
            setEmail('');
        } catch (error) {
            setMessage('Error requesting password reset: ' + (error.response ? error.response.data.detail : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Request Password Reset</h1>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Request Password Reset</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default PasswordResetRequest;