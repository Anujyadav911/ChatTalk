import axios from "axios";

// Configure API base URL for different environments
const getBaseURL = () => {
  // If VITE_API_URL is provided (for production), use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development mode
  if (import.meta.env.MODE === "development") {
    return "https://chattalk-hwlv.onrender.com/api";
  }

  // Production fallback - relative path
  return "/api";
};

const BASE_URL = getBaseURL();

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
