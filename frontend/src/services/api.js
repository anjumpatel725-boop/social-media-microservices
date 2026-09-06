import React from "react";
import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_BASE_URL;

export const userAPI = axios.create({
    baseURL: `${API_GATEWAY}/users`
});

export const postAPI = axios.create({
    baseURL: `${API_GATEWAY}/posts`
});

export const mediaAPI = axios.create({
    baseURL: `${API_GATEWAY}/media`
});

export const chatAPI = axios.create({
    baseURL: `${API_GATEWAY}/chat`
});

export const notificationAPI = axios.create({
    baseURL: `${API_GATEWAY}/notifications`
});