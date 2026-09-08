# 🚀 Microservices-Based Social Media Platform

A full-stack social media application built using **React, Spring Boot, and Microservices Architecture**.

## ✨ Features

* 🔐 JWT Authentication & Spring Security
* 👤 User Registration, Login & Profiles
* 📝 Create, Update & Delete Posts
* 🖼️ Image / Media Upload
* 💬 Real-Time Chat using WebSocket
* 🔔 Notifications using RabbitMQ
* 📊 Analytics
* ⚡ Redis Caching & Resilience4j
* 🌐 API Gateway & Eureka Service Discovery
* 🐳 Docker & Docker Compose
* ☁️ Render Deployment

## 🛠️ Tech Stack

**Frontend:** React, Vite, Axios
**Backend:** Java, Spring Boot, Spring Cloud, Spring Security
**Database:** PostgreSQL
**Messaging:** RabbitMQ
**Cache:** Redis
**Real-Time:** WebSocket
**DevOps:** Docker, GitHub, Render

## 🏗️ Architecture

```text
React Frontend
      ↓
 API Gateway
      ↓
 ┌────┼────┬────────┐
User Post Media    Chat
 │     │     │       │
 └─────┴─────┴───────┘
          ↓
      PostgreSQL

Eureka → Service Discovery
RabbitMQ → Notifications
Redis → Caching
```

## 🌐 Live Demo

**Frontend:**
https://social-media-frontend-32gd.onrender.com

**Backend:**
https://social-media-microservices-xhq9.onrender.com

## 🔗 Backend Services

| Service              | Health Check                                                   |
| -------------------- | -------------------------------------------------------------- |
| Eureka Server        | https://social-media-microservices-xhq9.onrender.com/eureka/   |
| API Gateway          | https://api-gateway-cv45.onrender.com/actuator/health          |
| User Service         | https://user-service-37kw.onrender.com/actuator/health         |
| Post Service         | https://post-service-xsaj.onrender.com/actuator/health         |
| Media Service        | https://media-service-a2vk.onrender.com/actuator/health        |
| Chat Service         | https://chat-service-qi8g.onrender.com/actuator/health         |
| Notification Service | https://notification-service-npwh.onrender.com/actuator/health |
| Analytics Service    | https://analytics-service-73yk.onrender.com/actuator/health    |



## 👨‍💻 Author

**Anjum Patel**
B.Tech Computer Science & Engineering

