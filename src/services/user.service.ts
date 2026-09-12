import { apiClient } from "@/api/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "agent" | "buyer";
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

export interface PropertyImage {
  id: string;
  image: string;
  is_cover: boolean;
  created_at: string;
}

export interface NearestProperty {
  id: string;
  agent: string;
  agent_name: string;
  title: string;
  category: string;
  category_name?: string;
  category_details?: {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  tag?: string[];
  tags?: string[];
  price: string;
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude: string;
  longitude: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  total_rooms: number;
  facilities: string[];
  status: string;
  is_published: boolean;
  is_boosted: boolean;
  is_featured: boolean;
  is_saved?: boolean;
  views_count: number;
  inquiries_count: number;
  cover_photo: string | null;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
  distance_km?: number | null;
}

export interface TopAgent {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone_number: string;
  profile_picture: string | null;
  agency_name: string;
  license_number: string | null;
  rating: number;
  bio: string;
  date_joined: string;
  total_listings_count: number;
  listings: NearestProperty[];
}

export interface TopLocation {
  location: string;
  listings_count: number;
  cover_photo: string | null;
  avg_price: number;
}

export interface SavedProperty {
  id: string;
  buyer: string;
  listing: string;
  listing_details: NearestProperty;
  created_at: string;
}

export interface SavedPropertyResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SavedProperty[];
}

export interface PropertiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NearestProperty[];
}

export interface DashboardResponse {
  profile_picture?: string | null;
  user_location: {
    full_name?: string;
    email?: string;
    profile_picture?: string | null;
    latitude: string | null;
    longitude: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };
  nearest_properties: NearestProperty[];
  top_agents: TopAgent[];
  top_locations: TopLocation[];
}

export const UserService = {
  getBuyerProfile: async (): Promise<BuyerProfile> => {
    const response = await apiClient.get("/buyers/profile/");
    return response.data;
  },

  updateBuyerProfile: async (
    data: Partial<BuyerProfile>,
  ): Promise<BuyerProfile> => {
    const response = await apiClient.patch("/buyers/profile/", data);
    return response.data;
  },

  getBuyerDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get("/buyers/dashboard/");
    return response.data;
  },

  toggleSavedProperty: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/buyers/saved/`, {
      listing_id: id,
    });
    return response.data;
  },

  getSavedProperties: async (): Promise<SavedPropertyResponse> => {
    const response = await apiClient.get('/buyers/saved/');
    return response.data;
  },

  getProperties: async (params: { 
    page?: number; 
    page_size?: number; 
    search?: string; 
    q?: string;
    category?: string; 
    tag?: string;
    tags?: string;
    city?: string;
    state?: string;
    country?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    bathrooms?: number;
    latitude?: number;
    longitude?: number;
    radius_km?: number;
  }): Promise<PropertiesResponse> => {
    const response = await apiClient.get('/buyers/properties/', { params });
    return response.data;
  },

  getPropertyById: async (id: string): Promise<NearestProperty> => {
    const response = await apiClient.get(`/buyers/properties/${id}/`);
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
  updateProfile: async (
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<UserProfile> => {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },
};
