import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/chat`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const chatAPI = {

    // =========================================
    // GET USERS WITH WHOM CURRENT USER HAS CHATTED
    // =========================================
    getConversations: async (userId) => {
        const response = await axios.get(
            `${API_URL}/conversations/${userId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

    // =========================================
    // GET CONVERSATION
    // =========================================
    getConversation: async (user1, user2) => {
        const response = await axios.get(
            `${API_URL}/conversation`,
            {
                params: {
                    user1,
                    user2,
                },
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

    // =========================================
    // SEND MESSAGE
    // =========================================
    sendMessage: async (messageData) => {
        const response = await axios.post(
            `${API_URL}/messages`,
            messageData,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

    // =========================================
    // GET UNREAD MESSAGES
    // =========================================
    getUnreadMessages: async (userId) => {
        const response = await axios.get(
            `${API_URL}/unread/${userId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

    // =========================================
    // MARK ONE MESSAGE AS READ
    // =========================================
    markAsRead: async (messageId) => {
        const response = await axios.put(
            `${API_URL}/messages/${messageId}/read`,
            {},
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

    // =========================================
    // DELETE MESSAGE
    // =========================================
    deleteMessage: async (messageId) => {
        const response = await axios.delete(
            `${API_URL}/messages/${messageId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },
};