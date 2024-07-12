// services/api.js
import axios from 'axios';

const API_URL = 'https://tokyoquest.onrender.com/api';  // 環境変数の代わりに直接URLを設定

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const login = async (accountId, password) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/login/`, {
            account_id: accountId,
            password,
        });
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const logout = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/logout/`, {
            refresh: refreshToken
        }, getAuthHeaders());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }
    return null;
};

export const getIncompleteQuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/quests/incomplete/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/quests/incomplete/`, getAuthHeaders()).then(response => response.data);
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
                return await axios.get(`${API_URL}/accounts/profile/`, getAuthHeaders()).then(response => response.data);
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
                return await axios.put(`${API_URL}/accounts/profile/update/`, profileData, getAuthHeaders()).then(response => response.data);
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
                return await axios.put(`${API_URL}/accounts/profile/change-password/`, {
                    current_password: currentPassword,
                    new_password: newPassword
                }, getAuthHeaders()).then(response => response.data);
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
        console.log(`Sending request with UID: ${uid}, Token: ${token}, New Password: ${newPassword}`);
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


export const completeQuest = async (questId, media) => {
    const formData = new FormData();
    formData.append('media', media);

    // FormDataの内容を詳細にログに出力
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) { 
        console.log(`${key}: ${value.name}, size: ${value.size}, type: ${value.type}`);
    }

    try {
        console.log('Sending FormData:', formData);
        const response = await axios.post(`${API_URL}/quests/${questId}/complete/`, formData, {
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.post(`${API_URL}/quests/${questId}/complete/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => response.data);
            }
        }
        console.error('Error completing quest:', error);
        throw error;
    }
};

export const getQuest = async (questId) => {
    try {
        const response = await axios.get(`${API_URL}/quests/${questId}/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/quests/${questId}/`, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const getCompletedQuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/completed-quests/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/completed-quests/`, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const addQuestReview = async (questId, reviewData) => {
    try {
        const response = await axios.post(`${API_URL}/quests/${questId}/reviews/add/`, reviewData, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.post(`${API_URL}/quests/${questId}/reviews/add/`, reviewData, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const getQuestReviews = async (questId) => {
    try {
        const response = await axios.get(`${API_URL}/quests/${questId}/reviews/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/quests/${questId}/reviews/`, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const claimTicket = async (ticketId) => {
    try {
        const response = await axios.post(`${API_URL}/tickets/${ticketId}/claim/`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.post(`${API_URL}/tickets/${ticketId}/claim/`, {}, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const useTicket = async (issuanceId) => {
    try {
        const response = await axios.post(`${API_URL}/tickets/${issuanceId}/use/`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.post(`${API_URL}/tickets/${issuanceId}/use/`, {}, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const getTickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/tickets/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/tickets/`, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const getTicketIssuances = async (ticketId) => {
    try {
        const response = await axios.get(`${API_URL}/tickets/${ticketId}/issuances/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await axios.get(`${API_URL}/tickets/${ticketId}/issuances/`, getAuthHeaders()).then(response => response.data);
            }
        }
        throw error;
    }
};

export const searchQuestsByTag = async (tag) => {
    console.log(`Searching quests by tag: ${tag}`);
    try {
        const response = await axios.get(`${API_URL}/quests/search/`, {
            params: { tag },
            headers: getAuthHeaders().headers
        });
        console.log(`Received response:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching quests:', error);
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.get(`${API_URL}/quests/search/`, {
                    params: { tag },
                    headers: getAuthHeaders().headers
                });
                console.log(`Received response after refresh:`, response.data);
                return response.data;
            }
        }
        throw error;
    }
};

export const getReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/quests/reports/`, getAuthHeaders());
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            return [response.data];
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                const response = await axios.get(`${API_URL}/quests/reports/`, getAuthHeaders());
                if (Array.isArray(response.data)) {
                    return response.data;
                } else {
                    return [response.data];
                }
            }
        }
        throw error;
    }
};