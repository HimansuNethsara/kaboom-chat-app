<h1 align="center">💥 Kaboom - Real-Time Chat App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Java_8-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 8" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="WebSockets" />
</p>

<p align="center">
  <strong>Kaboom</strong> is a mobile-first, real-time chat application built with React Native and a Java EE WebSocket backend. It supports account management, live presence tracking, and instant messaging.
</p>

> *Note: This is one of my early foundational projects, built to explore cross-platform mobile development, WebSockets, and REST API integration. It served as a stepping stone to my later enterprise-grade applications.*

---

## 📖 Overview

**Kaboom** is a full-stack chat application designed for seamless mobile communication. It features a React Native/Expo frontend that communicates with a Java EE backend via REST servlets for account/profile operations and WebSockets for live, bidirectional chat and contact updates. 

Data is persisted in a MySQL database using Hibernate ORM, while profile images are handled via static file URLs.

## ✨ Key Features

### 📱 Accounts & Profiles
- Phone-number-based registration and sign-in.
- Duplicate phone-number prevention.
- Persistent local user ID via `AsyncStorage`.
- Profile image/avatar selection.
- Light, dark, and system theme modes.

### 💬 Real-Time Chat
- One-to-one WebSocket messaging.
- Persistent chat history and recent chat lists.
- Unread message counts and message statuses (`SENT`, `DELIVERED`, `READ`).
- Live online/offline presence tracking.
- Contact management with custom local display names.

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React Native, Expo, TypeScript, React Navigation, NativeWind (Tailwind) |
| **Backend** | Java 8 (Java EE 8), Servlets, Java WebSocket API |
| **Database** | MySQL 8.0, Hibernate 4.3, C3P0 |
| **Server** | GlassFish 5, NetBeans Ant |
| **Networking** | ngrok (for HTTPS/WSS external exposure) |

## 📸 System Showcase

| Home Screen | Chat Interface | Contacts | Sign In |
| :---: | :---: | :---: | :---: |
| <img src="assets/home-screen.png" alt="Home"> | <img src="assets/chat-send-message.png" alt="Chat"> | <img src="assets/contacts-screen.png" alt="Contacts"> | <img src="assets/sign-in-login-page.png" alt="Sign In"> |

## 🗄️ Database Schema

The application uses a MySQL database named `kaboom` with the following core Hibernate entities:

- **`User`**: Identity, phone number, status (Online/Offline), and bio.
- **`Chat`**: Individual messages, sender/recipient, text, status, and timestamps.
- **`FriendList`**: Contact mappings (Owner user, Friend user, display name).
- **`Status` (Enum)**: Centralized enum for `ACTIVE`, `BLOCKED`, `DELIVERED`, `READ`, `SENT`, `ONLINE`, `OFFLINE`.

**Entity-Relationship Diagram:**
<p align="center">
  <img src="assets/er-diagram.png" width="800" alt="ER Diagram">
</p>

## 🏗️ System Architecture

The project is a client-server monolith divided into two main directories:
1. **Frontend (`/Frontend`):** Expo/React Native application.
2. **Backend (`/Backend`):** Java EE WebSocket server and servlet API.

Real-time operations flow through the `/Kaboom/chat?userId=<id>` WebSocket endpoint, while Hibernate handles the transactional persistence to MySQL. 

## 🚀 Known Limitations & Future Enhancements

*(Note: As an early foundational project, the following production-level improvements were identified for future iterations).*
- [ ] **Security:** Implement password hashing and OTP verification (current auth is phone-number identification only).
- [ ] **Security:** Secure WebSocket connections with JWTs to prevent `userId` spoofing.
- [ ] **Security:** Remove hardcoded database credentials from `hibernate.cfg.xml`.
- [ ] **Features:** Implement the placeholder screens (Calls, Status, Settings).
- [ ] **Infrastructure:** Replace hardcoded ngrok URLs with dynamic environment variables.

## 👨‍💻 Author

**Himansu Nethsara Ranasinghe**
- 🎓 BSc (Hons) Software Engineering Undergraduate (JIAT / BCU)
- 🔗 [LinkedIn](https://www.linkedin.com/in/himansu-nethsara/)
- 🐙 [GitHub](https://github.com/HimansuNethsara)