import { apiClient } from '@/api/client';

export interface Category {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  full_name: string;
  email: string;
  profile_picture: string;
}

export interface ListingImage {
  id: string;
  image: string;
  is_cover: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  agent: string;
  agent_name: string;
  title: string;
  category: string;
  price: string;
  address: string;
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
  views_count: number;
  inquiries_count: number;
  cover_photo: string;
  images: ListingImage[];
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  active_listings: {
    count: number;
    note: string;
  };
  new_inquiries: {
    count: number;
    note: string;
  };
  subscription: {
    plan_name: string;
    days_left: number;
    days_left_text: string;
  };
  views: {
    total_views: number;
    trend: string;
  };
}

export interface AgentDashboardResponse {
  greeting: string;
  agent: Agent;
  metrics: DashboardMetrics;
  active_listings: Listing[];
}

export interface PaginatedListingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}

export interface AgentProfile {
  id: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  phone_number: string | null;
  profile_picture: string | null;
  latitude: string | null;
  longitude: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  bio: string | null;
  agency_name: string | null;
  license_number: string | null;
  rating: number | null;
}

export const AgentService = {
  /**
   * Fetch the agent dashboard data for the home screen
   */
  getDashboard: async (): Promise<AgentDashboardResponse> => {
    const response = await apiClient.get('/agents/dashboard/');
    return response.data;
  },

  /**
   * Fetch the agent's listings with pagination, filtering, and search
   */
  getMyListings: async (params?: { page?: number; page_size?: number; type?: string; search?: string }): Promise<PaginatedListingsResponse> => {
    const response = await apiClient.get('/agents/properties/my-listings/', { params });
    return response.data;
  },

  /**
   * Fetch the agent's full profile
   */
  getProfile: async (): Promise<AgentProfile> => {
    const response = await apiClient.get('/agents/profile/');
    return response.data;
  },

  /**
   * Update the agent's profile
   */
  updateProfile: async (data: Partial<Omit<AgentProfile, 'id' | 'user' | 'profile_picture'> & { user?: { full_name?: string } }>): Promise<AgentProfile> => {
    const response = await apiClient.patch('/agents/profile/', data);
    return response.data;
  },

  /**
   * Fetch listing categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/agents/categories/');
    return response.data;
  },

  /**
   * Create a new property listing
   */
  createListing: async (data: FormData): Promise<Listing> => {
    const response = await apiClient.post('/agents/properties/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch a specific property listing by ID
   */
  getListing: async (id: string): Promise<Listing> => {
    const response = await apiClient.get(`/agents/properties/${id}/`);
    return response.data;
  }
};
