import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http"; // ✅ for socket.io
import { Server } from "socket.io"; // ✅ socket.io

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3001; // ✅ use Render’s dynamic port
const __dirname = path.resolve();

// ----------------------
// ✅ Environment checks
// ----------------------
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is required");
  process.exit(1);
}

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT_SECRET_KEY environment variable is required");
  process.exit(1);
}

// ----------------------
// ✅ CORS setup
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "production") {
      if (origin.includes(".onrender.com") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ----------------------
// ✅ Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ----------------------
// ✅ Serve frontend in prod
// ----------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ----------------------
// ✅ Socket.io setup
// ----------------------
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // ✅ allow frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ----------------------
// ✅ Start server
// ----------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
