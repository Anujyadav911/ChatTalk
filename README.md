# 💬 ChatTalk

A modern, full-stack real-time communication platform built with React and Node.js. ChatTalk enables users to connect through instant messaging, video calls, and friend management features.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT-based authentication
- 👥 **Friend Management** - Send, accept, and manage friend requests
- 💬 **Real-time Chat** - Instant messaging powered by Stream.io
- 📹 **Video Calling** - High-quality video calls using Stream.io Video SDK
- 🔔 **Notifications** - Real-time notifications for friend requests and messages
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS and DaisyUI
- 🌓 **Theme Support** - Dark and light mode themes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** (v19.0.0) - Modern UI library
- **React DOM** (v19.0.0) - React rendering library
- **Vite** (v6.3.1) - Fast build tool and dev server
- **React Router** (v7.5.1) - Client-side routing
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework
- **DaisyUI** (v4.12.24) - Component library for Tailwind
- **PostCSS** (v8.5.3) - CSS processing tool
- **Autoprefixer** (v10.4.21) - CSS vendor prefixing
- **Stream Chat** (v8.60.0) - Stream.io chat client SDK
- **Stream Chat React** (v12.14.0) - React components for Stream Chat
- **Stream Video React SDK** (v1.14.4) - Video calling capabilities
- **Zustand** (v5.0.3) - Lightweight state management
- **TanStack React Query** (v5.74.4) - Server state management and data fetching
- **Axios** (v1.8.4) - HTTP client for API requests
- **React Hot Toast** (v2.5.2) - Toast notification library
- **Lucide React** (v0.503.0) - Beautiful icon library
- **ESLint** (v9.22.0) - Code linting and quality tool

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** (v4.21.0) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (v8.13.2) - MongoDB object modeling library
- **JSON Web Token** (v9.0.2) - Authentication token management
- **bcryptjs** (v3.0.2) - Password hashing library
- **Stream Chat** (v8.60.0) - Stream.io chat server SDK
- **Cookie Parser** (v1.4.7) - Cookie parsing middleware
- **CORS** (v2.8.5) - Cross-origin resource sharing middleware
- **dotenv** (v16.5.0) - Environment variable management
- **Nodemon** (v3.1.9) - Development auto-reload tool

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)
- **Stream.io Account** (for chat and video features)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Anujyadav911/ChatTalk.git
cd ChatTalk
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the root script:

```bash
npm run build
```

### 3. Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET_KEY=your_jwt_secret_key

# Stream.io Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Server Configuration
PORT=4001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4001/api

# Stream.io Configuration
VITE_STREAM_API_KEY=your_stream_api_key
```

**Note:** `VITE_STREAM_API_KEY` should match your `STREAM_API_KEY` from the backend `.env` file.

### 4. Get Stream.io Credentials

1. Sign up at [Stream.io](https://getstream.io/)
2. Create a new application
3. Copy your `API Key` and `API Secret` from the dashboard
4. Add them to your `.env` files

### 5. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:4001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

#### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend in production)
cd ../backend
npm start
```

## 📁 Project Structure

```
ChatTalk/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   └── user.controller.js
│   │   ├── lib/              # Utility libraries
│   │   │   ├── db.js         # MongoDB connection
│   │   │   └── stream.js     # Stream.io client
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.middleware.js
│   │   ├── models/           # Mongoose models
│   │   │   ├── User.js
│   │   │   └── FriendRequest.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── user.route.js
│   │   │   └── chat.route.js
│   │   └── server.js         # Express app entry point
│   ├── package.json
│   └── .env                  # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand stores
│   │   ├── constants/       # Constants and config
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── public/              # Static assets
│   ├── package.json
│   └── .env                 # Frontend environment variables
│
├── package.json             # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/onboarding` - Complete user onboarding
- `GET /api/auth/me` - Get current user

### Users (`/api/users`)

- `GET /api/users` - Get recommended users
- `GET /api/users/friends` - Get user's friends
- `POST /api/users/friend-request/:id` - Send friend request
- `PUT /api/users/friend-request/:id/accept` - Accept friend request
- `GET /api/users/friend-requests` - Get incoming friend requests
- `GET /api/users/outgoing-friend-requests` - Get outgoing friend requests

### Chat (`/api/chat`)

- `GET /api/chat/token` - Get Stream.io token
- `POST /api/chat/ensure-users` - Ensure users exist in Stream
- `POST /api/chat/sync-all-users` - Sync all users to Stream

## 🚢 Deployment

### Deploying to Render

1. **Create a Render Account**
   - Sign up at [Render.com](https://render.com)

2. **Create a Web Service**
   - Connect your GitHub repository
   - Set the following:
     - **Build Command:** `cd backend && npm install && cd ../frontend && npm install && npm run build`
     - **Start Command:** `cd backend && npm start`
     - **Environment:** Node

3. **Add Environment Variables**
   Add all environment variables from your `.env` files:
   - `MONGO_URI`
   - `JWT_SECRET_KEY`
   - `STREAM_API_KEY`
   - `STREAM_API_SECRET`
   - `VITE_STREAM_API_KEY` (same as `STREAM_API_KEY`)
   - `FRONTEND_URL` (your Render URL)
   - `VITE_API_URL` (your Render API URL)
   - `NODE_ENV=production`

4. **Deploy**
   - Render will automatically build and deploy your application
   - The backend will serve the frontend in production mode

### Important Notes for Deployment

- **Vite Environment Variables:** Variables prefixed with `VITE_` are embedded at build time. Make sure to add `VITE_STREAM_API_KEY` and `VITE_API_URL` before building.
- **CORS Configuration:** Update `FRONTEND_URL` in your backend environment variables to match your production domain.
- **HTTPS:** Stream.io requires HTTPS in production. Render provides this automatically.

For more deployment details, see [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md).

## 🧪 Development

### Available Scripts

**Root:**
- `npm run build` - Install dependencies and build frontend
- `npm start` - Start backend server

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Anuj Yadav**

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Stream.io](https://getstream.io/) for providing excellent real-time communication infrastructure
- [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/) for the beautiful UI components
- The open-source community for amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

Made with ❤️ by the ChatTalk team
