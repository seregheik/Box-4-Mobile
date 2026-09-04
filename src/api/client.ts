import { create } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { router } from "expo-router";

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
    const isLoginEndpoint = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Handle unauthorized errors globally (e.g., clear token, logout user)
      console.log(
        "Unauthorized! Clearing caches and redirecting to login.",
      );
      useAuthStore.getState().clearAuth();
      useProfileStore.getState().setProfile(null);
      
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
