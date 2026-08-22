import { create } from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://box4realestate.cloud/api/v1";

export const apiClient = create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().access;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from AuthStore:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors globally (e.g., clear token, logout user)
      console.log(
        "Unauthorized! Clearing auth store and redirecting to login.",
      );
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
