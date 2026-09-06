import axios from "axios";

const API_URL =
    "http://localhost:8080/posts";


// ==========================================
// GET AUTH TOKEN
// ==========================================

const getAuthHeaders = () => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return {};
    }

    return {
        Authorization:
            `Bearer ${token}`,
    };
};


// ==========================================
// POST API
// ==========================================

export const postAPI = {

    // ======================================
    // CREATE POST
    // ======================================

    createPost: async (postData) => {

        console.log(
            "POST DATA:",
            postData
        );


        const response =
            await axios.post(
                API_URL,
                postData,
                {
                    headers: {
                        ...getAuthHeaders(),

                        "Content-Type":
                            "application/json",
                    },
                }
            );


        console.log(
            "POST CREATED:",
            response.data
        );


        return response.data;
    },


    // ======================================
    // GET ALL POSTS
    // ======================================

    getAllPosts: async () => {

        const response =
            await axios.get(
                API_URL,
                {
                    headers:
                        getAuthHeaders(),
                }
            );

        return response.data;
    },


    // ======================================
    // GET POSTS BY USER
    // ======================================

    getPostsByUser: async (userId) => {

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
    // GET SINGLE POST
    // ======================================

    getPostById: async (id) => {

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
    // UPDATE POST
    // ======================================

    updatePost: async (
        id,
        postData
    ) => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                postData,
                {
                    headers: {
                        ...getAuthHeaders(),

                        "Content-Type":
                            "application/json",
                    },
                }
            );

        return response.data;
    },


    // ======================================
    // DELETE POST
    // ======================================

    deletePost: async (id) => {

        await axios.delete(
            `${API_URL}/${id}`,
            {
                headers:
                    getAuthHeaders(),
            }
        );
    },
};