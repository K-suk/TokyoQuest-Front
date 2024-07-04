import { useRouter } from 'next/router';
import { logout, refreshToken } from '/services/api';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
            console.error('No refresh token found for logout');
            return;
        }

        try {
            console.log('Sending logout request with refresh token:', refreshTokenValue);
            await logout(refreshTokenValue);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/login');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    try {
                        console.log('Retrying logout request with new access token');
                        await logout(refreshTokenValue);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        router.push('/login');
                    } catch (logoutError) {
                        console.error('Error logging out after token refresh:', logoutError.response ? logoutError.response.data : logoutError.message);
                    }
                }
            } else {
                console.error('Error logging out:', error.response ? error.response.data : error.message);
            }
        }
    };

    return (
        <a className='nav-link' onClick={handleLogout} style={{ cursor: 'pointer', color: '#fff' }}>
            Logout
        </a>
    );
};

export default LogoutButton;