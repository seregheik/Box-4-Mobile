import { apiClient } from '@/api/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'buyer';
}

export interface BuyerProfile {
  id: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: "buyer";
  };
  full_name: string;
  phone_number: string | null;
  profile_picture: string | null;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  bio: string | null;
}

export const UserService = {
  getBuyerProfile: async (): Promise<BuyerProfile> => {
    const response = await apiClient.get('/buyers/profile/');
    return response.data;
  },
  
  updateBuyerProfile: async (data: Partial<BuyerProfile>): Promise<BuyerProfile> => {
    const response = await apiClient.patch('/buyers/profile/', data);
    return response.data;
  },
  
  /**
   * Example endpoint to fetch a specific user's profile
   */
  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Example endpoint to update a user's profile
   */
  updateProfile: async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },
};
