import { apiClient } from '@/api/client';

export interface Agent {
  id: string;
  full_name: string;
  email: string;
  profile_picture: string;
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
  active_listings: any[]; // Update this with specific listing type when available
}

export const AgentService = {
  /**
   * Fetch the agent dashboard data for the home screen
   */
  getDashboard: async (): Promise<AgentDashboardResponse> => {
    const response = await apiClient.get('/agents/dashboard/');
    return response.data;
  },
};
