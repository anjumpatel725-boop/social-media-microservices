import axios from "axios";

const API_URL =
    "http://localhost:8080/notifications";


const getHeaders = () => {

    const token =
        localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


export const notificationAPI = {

    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    getNotifications: async (userId) => {

        const response =
            await axios.get(
                `${API_URL}/user/${userId}`,
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },


    // =====================================================
    // GET UNREAD
    // =====================================================

    getUnreadNotifications: async (userId) => {

        const response =
            await axios.get(
                `${API_URL}/user/${userId}/unread`,
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },


    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    markAsRead: async (id) => {

        const response =
            await axios.put(
                `${API_URL}/${id}/read`,
                {},
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },


    // =====================================================
    // DELETE
    // =====================================================

    deleteNotification: async (id) => {

        await axios.delete(
            `${API_URL}/${id}`,
            {
                headers: getHeaders(),
            }
        );
    },


   
};