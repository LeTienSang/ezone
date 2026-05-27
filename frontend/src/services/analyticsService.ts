import { api } from './api';

export interface DashboardStatsResponse {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeClasses: number;
}

export const analyticsService = {
  async getDashboardStats() {
    const res = await api.get<DashboardStatsResponse>('/api/v1/admin/analytics/dashboard');
    return res.data;
  },
};

export default analyticsService;