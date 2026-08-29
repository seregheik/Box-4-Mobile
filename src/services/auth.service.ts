import { apiClient } from "@/api/client";

export interface LoginCredentials {
  role?: "agent" | "buyer";
  email?: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  role: "agent" | "buyer";
  id: string;
  email: string;
  full_name: string;
  is_email_verified: boolean;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: "agent" | "buyer";
    is_email_verified: boolean;
  };
}

export const AuthService = {
  /**
   * Register as an agent or user
   */
  register: async (
    credentials: RegisterCredentials,
  ): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/register/", credentials);
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: {
    email: string;
    otp_code: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/verify-otp/", data);
    return response.data;
  },
  resendOtp: async (data: { email: string }): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/resend-otp/", data);
    return response.data;
  },

  /**
   * Example login endpoint
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login/", credentials);
    return response.data;
  },

  /**
   * Example logout endpoint
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout/");
  },

  /**
   * Example endpoint to fetch the current user's profile
   */
  getMe: async () => {
    const response = await apiClient.get("/auth/me/");
    return response.data;
  },
};
