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
  async getNewUsersSeries(days = 7) {
    const res = await api.get<any>(`/api/v1/admin/analytics/new-users?days=${days}`);
    return res.data;
  },
  async getMonthlyRevenueSeries(months = 6) {
    const res = await api.get<any>(`/api/v1/admin/analytics/revenue-monthly?months=${months}`);
    return res.data;
  }
};

export default analyticsService;