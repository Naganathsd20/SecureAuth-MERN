# SecureAuth MERN - Production Authentication System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

A full-stack, secure, production-grade MERN (MongoDB, Express, React, Node.js) Authentication System equipped with JWT token authorization, bcryptjs password hashing, client/server side form validation, protected routes, and a dark-mode responsive glassmorphism UI.

---

## ✨ Features Checklist

- [x] **User Registration**: Create accounts with real-time password strength & matching validation.
- [x] **User Login**: Secure login with JWT token issuing and error alerts.
- [x] **JWT Authentication**: Signed Bearer token authentication for all protected endpoints.
- [x] **bcryptjs Hashing**: 10-round salted password encryption before database persistence.
- [x] **Protected Dashboard**: Secured route displaying session status, account metrics, and interactive API middleware tester.
- [x] **User Profile Management**: Update user profile details (Name, Email, Bio, Password).
- [x] **Logout Functionality**: Destroys local session token and redirects securely.
- [x] **Form Validation**: Double-layered validation (Client-side UI checks + Server-side `express-validator`).
- [x] **MongoDB & Mongoose**: Schemas with pre-save hooks, index constraints, and sanitized JSON transformers.
- [x] **Responsive Glassmorphism UI**: Vibrant Tailwind CSS interface with Lucide icons and smooth animations.

---

## 🏗️ Project Architecture

```
SecureAuth-MERN/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Alert.jsx        # Notification & error alerts
│   │   │   ├── LoadingSpinner.jsx # Loading states
│   │   │   ├── Navbar.jsx       # Responsive header navigation
│   │   │   └── ProtectedRoute.jsx # Auth route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global React auth state & persistence
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Protected landing dashboard
│   │   │   ├── Login.jsx        # Sign in page
│   │   │   ├── NotFound.jsx     # 404 error page
│   │   │   ├── Profile.jsx      # Profile settings page
│   │   │   └── Register.jsx     # Account creation page
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with Bearer interceptor
│   │   ├── App.jsx              # Router & layout entry point
│   │   ├── index.css            # Tailwind directives & glassmorphism
│   │   └── main.jsx             # DOM mounting
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                      # Node.js + Express Backend
    ├── src/
    │   ├── config/
    │   │   └── db.js            # Mongoose MongoDB connection
    │   ├── controllers/
    │   │   └── authController.js# Register, Login, Get Profile, Update Profile
    │   ├── middleware/
    │   │   ├── authMiddleware.js# JWT verification middleware
    │   │   └── errorMiddleware.js# Global 404 and Error handlers
    │   ├── models/
    │   │   └── User.js          # Mongoose schema with bcrypt hooks
    │   ├── routes/
    │   │   └── authRoutes.js    # Express-validator input validation & routes
    │   └── server.js            # Express server initialization
    ├── .env                     # Environment variables
    ├── test-auth.js             # Automated API integration test script
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite build tool)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3 + Custom Glassmorphism
- **HTTP Client**: Axios with Request Interceptors
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: `jsonwebtoken` (JWT), `bcryptjs`
- **Validation**: `express-validator`
- **CORS**: `cors` package configured for frontend origin

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or a MongoDB Atlas URI

### 1. Clone & Setup Backend

```bash
cd server
npm install
```

Ensure `server/.env` contains your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/secureauth_db
JWT_SECRET=secure_mern_auth_jwt_super_secret_key_2026_x99!
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 2. Setup & Start Frontend

```bash
cd ../client
npm install
npm run dev
# Client will run on http://localhost:5173
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health status check |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile (Requires Bearer token) |
| `PUT` | `/api/auth/profile` | Private | Update user profile details (Requires Bearer token) |

---

## 🧪 Running Automated Tests

Run the included backend integration test suite:

```bash
cd server
node test-auth.js
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
