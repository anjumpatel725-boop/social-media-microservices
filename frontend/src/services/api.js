import React from "react";
import axios from "axios";

const API_GATEWAY = "http://localhost:8080";

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