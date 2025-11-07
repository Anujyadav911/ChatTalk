import "dotenv/config";
import express from "express";
// import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 4001;

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is required");
  process.exit(1);
}

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT_SECRET_KEY environment variable is required");
  process.exit(1);
}

if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
  console.error("STREAM_API_KEY and STREAM_API_SECRET environment variables are required");
  process.exit(1);
}

const __dirname = path.resolve();

// Configure CORS for both development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://localhost:3000",
  "https://chattalk-hwlv.onrender.com", // Production URL
];

// Add production domain if FRONTEND_URL is provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// In production, allow any Render domain or the specific frontend URL
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    // In production, be more flexible with Render domains
    if (process.env.NODE_ENV === "production") {
      // Allow any render.com subdomain or the specific frontend URL
      if (origin.includes(".onrender.com") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else {
      // In development, use the allowed origins list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow frontend to send cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
