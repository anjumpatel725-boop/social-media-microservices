import axios from "axios";

const API_URL = "http://localhost:8080/media";


// ==========================================
// AUTH HEADER
// ==========================================

const getAuthHeaders = () => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};


// ==========================================
// MEDIA API
// ==========================================

export const mediaAPI = {

    // ======================================
    // UPLOAD IMAGE
    // ======================================

    uploadMedia: async (file, userId) => {

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        formData.append(
            "userId",
            userId
        );


        console.log(
            "UPLOADING MEDIA:",
            file.name
        );


        const response =
            await axios.post(
                `${API_URL}/upload`,
                formData,
                {
                    headers: {
                        ...getAuthHeaders(),
                    },
                }
            );


        console.log(
            "MEDIA UPLOAD RESPONSE:",
            response.data
        );


        return response.data;
    },


    // ======================================
    // GET MEDIA
    // ======================================

    getMedia: async (id) => {

        const response =
            await axios.get(
                `${API_URL}/${id}`,
                {
                    headers:
                        getAuthHeaders(),
                }
            );

        return response.data;
    },


    // ======================================
    // MEDIA FILE URL
    // ======================================

    getMediaUrl: (id) => {

        return `${API_URL}/file/${id}`;
    },


    // ======================================
    // USER MEDIA
    // ======================================

    getUserMedia: async (userId) => {

        const response =
            await axios.get(
                `${API_URL}/user/${userId}`,
                {
                    headers:
                        getAuthHeaders(),
                }
            );

        return response.data;
    },


    // ======================================
    // DELETE
    // ======================================

    deleteMedia: async (id) => {

        await axios.delete(
            `${API_URL}/${id}`,
            {
                headers:
                    getAuthHeaders(),
            }
        );
    },
};