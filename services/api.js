import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const login = async (accountId, password) => {
    const response = await axios.post(`${API_URL}/accounts/login/`, {
        account_id: accountId,
        password,
    });
    return response.data;
};

export const logout = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/logout/`, {
            refresh: refreshToken
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Logout error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            const response = await axios.post(`${API_URL}/accounts/token/refresh/`, { refresh: refreshToken });
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
        }
    }
    return null;
};

export const getIncompleteQuests = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No access token available');
    }

    try {
        const response = await axios.get(`${API_URL}/quests/incomplete/`, {
            headers: {
                'Authorization': `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.get(`${API_URL}/quests/incomplete/`, {
                    headers: { 'Authorization': `Bearer ${newAccessToken}` },
                });
                return response.data;
            }
        }
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/accounts/profile/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.get(`${API_URL}/accounts/profile/`, getAuthHeaders());
                return response.data;
            }
        }
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/accounts/profile/update/`, profileData, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.put(`${API_URL}/accounts/profile/update/`, profileData, getAuthHeaders());
                return response.data;
            }
        }
        throw error;
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/accounts/profile/change-password/`, {
            current_password: currentPassword,
            new_password: newPassword
        }, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.put(`${API_URL}/accounts/profile/change-password/`, {
                    current_password: currentPassword,
                    new_password: newPassword
                }, getAuthHeaders());
                return response.data;
            }
        }
        throw error;
    }
};

export const requestPasswordReset = async (email) => {
    const response = await axios.post(`${API_URL}/accounts/password-reset-request/`, { email });
    return response.data;
};

export const resetPassword = async (uid, token, newPassword) => {
    try {
        console.log(`Sending request with UID: ${uid}, Token: ${token}, New Password: ${newPassword}`);  // リクエストデータをログに出力
        const response = await axios.post(`${API_URL}/accounts/password-reset/`, {
            uid: uid,
            token: token,
            new_password: newPassword
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const completeQuest = async (questId) => {
    const response = await axios.post(`${API_URL}/quests/${questId}/complete/`, {}, getAuthHeaders());
    return response.data;
};