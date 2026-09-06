import axios from "axios";

const API_URL = "http://localhost:8080/users";

export const authAPI = {

    register: async (data) => {

        console.log("REGISTER API REQUEST:", data);

        const response = await axios.post(
            `${API_URL}/register`,
            data
        );

        console.log(
            "REGISTER API STATUS:",
            response.status
        );

        console.log(
            "REGISTER API RESPONSE:",
            response.data
        );

        return response.data;
    },

    login: async (data) => {

        console.log("LOGIN API REQUEST:", data);

        const response = await axios.post(
            `${API_URL}/login`,
            data
        );

        console.log(
            "LOGIN API STATUS:",
            response.status
        );

        console.log(
            "LOGIN API RESPONSE:",
            response.data
        );

        return response.data;
    }
};