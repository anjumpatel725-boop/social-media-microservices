import axios from "axios";

const API_URL = "http://localhost:8080/users";

const getAuthHeaders = () => {

    let token = localStorage.getItem("token");

    if (!token) {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            try {

                const user =
                    JSON.parse(storedUser);

                token = user?.token;

            } catch (error) {

                console.error(
                    "USER JSON ERROR:",
                    error
                );
            }
        }
    }

    console.log(
        "USER API TOKEN:",
        token ? "TOKEN FOUND" : "NO TOKEN"
    );

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`
    };
};


export const userAPI = {

    // ==========================================
    // GET ALL USERS
    // ==========================================

    getAllUsers: async () => {

        const response = await axios.get(
            API_URL,
            {
                headers: getAuthHeaders()
            }
        );

        return response.data;
    },


    // ==========================================
    // GET USER
    // ==========================================

    getUser: async (id) => {

        const response = await axios.get(
            `${API_URL}/${id}`,
            {
                headers: getAuthHeaders()
            }
        );

        return response.data;
    },


    // ==========================================
    // FOLLOW
    // ==========================================

    followUser: async (
        followingId,
        followerId
    ) => {

        console.log(
            "================================="
        );

        console.log(
            "FOLLOW USER"
        );

        console.log(
            "FOLLOWER ID:",
            followerId
        );

        console.log(
            "FOLLOWING ID:",
            followingId
        );

        console.log(
            "URL:",
            `${API_URL}/${followingId}/follow`
        );

        console.log(
            "================================="
        );

        const response =
            await axios.post(

                `${API_URL}/${followingId}/follow`,

                null,

                {
                    params: {
                        followerId: followerId
                    },

                    headers: getAuthHeaders()
                }
            );

        return response.data;
    },


    // ==========================================
    // UNFOLLOW
    // ==========================================

    unfollowUser: async (
        followingId,
        followerId
    ) => {

        const response =
            await axios.delete(

                `${API_URL}/${followingId}/follow`,

                {
                    params: {
                        followerId: followerId
                    },

                    headers: getAuthHeaders()
                }
            );

        return response.data;
    },


    // ==========================================
    // CHECK FOLLOWING
    // ==========================================

    isFollowing: async (
        followingId,
        followerId
    ) => {

        const response =
            await axios.get(

                `${API_URL}/${followingId}/following`,

                {
                    params: {
                        followerId: followerId
                    },

                    headers: getAuthHeaders()
                }
            );

        return response.data;
    },


    // ==========================================
    // FOLLOWERS COUNT
    // ==========================================

    getFollowersCount: async (
        userId
    ) => {

        const response =
            await axios.get(

                `${API_URL}/${userId}/followers/count`,

                {
                    headers: getAuthHeaders()
                }
            );

        return response.data;
    },


    // ==========================================
    // FOLLOWING COUNT
    // ==========================================

    getFollowingCount: async (
        userId
    ) => {

        const response =
            await axios.get(

                `${API_URL}/${userId}/following/count`,

                {
                    headers: getAuthHeaders()
                }
            );

        return response.data;
    }
};