import React, { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, Activity, TrendingUp, TrendingDown, BarChart3, LineChart, Loader2 } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeClasses: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await analyticsService.getDashboardStats();

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalCourses: statsData.totalCourses || 0,
        totalRevenue: statsData.totalRevenue || 0,
        activeClasses: statsData.activeClasses || 0
      });
    } catch (err) {
      console.error('Lỗi khi tải thống kê dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharts = async () => {
    try {
      const usersSeries = await analyticsService.getNewUsersSeries(7);
      // normalize values to numbers
      setNewUsersSeries({
        labels: usersSeries.labels || [],
        values: (usersSeries.values || []).map((v: any) => Number(v || 0)),
      });
    } catch (e) {
      console.error('Lỗi tải dữ liệu người dùng mới', e);
      // fallback: use last 7 days with totalUsers distributed to last day
      const labels = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
      });
      const values = labels.map((_, i) => (i === labels.length - 1 ? stats.totalUsers : 0));
      setNewUsersSeries({ labels, values });
    }
    try {
      const revSeries = await analyticsService.getMonthlyRevenueSeries(6);
      setRevenueSeries({
        labels: revSeries.labels || [],
        values: (revSeries.values || []).map((v: any) => Number(v || 0)),
      });
    } catch (e) {
      console.error('Lỗi tải dữ liệu doanh thu', e);
      // fallback: last 6 months with totalRevenue in current month
      const labels = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toISOString().slice(0, 7);
      });
      const values = labels.map((_, i) => (i === labels.length - 1 ? stats.totalRevenue : 0));
      setRevenueSeries({ labels, values });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const [newUsersSeries, setNewUsersSeries] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [revenueSeries, setRevenueSeries] = useState<{ labels: string[]; values: number[] } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="pb-10 animate-fadeIn">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-gray-500 mt-1">Theo dõi các chỉ số quan trọng của nền tảng Ezone ngày hôm nay.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            {loading && <Loader2 size={16} className="animate-spin" />} Tải lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-550 uppercase tracking-wider mb-1">Tổng người dùng</p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {loading ? '...' : stats.totalUsers.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 backdrop-blur-sm border border-blue-100">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs relative z-10 font-medium">
            <span className="text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={14} className="mr-1"/> +12%
            </span>
            <span className="text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-555 uppercase tracking-wider mb-1">Khóa học</p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {loading ? '...' : stats.totalCourses}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100/50 flex items-center justify-center text-purple-600 backdrop-blur-sm border border-purple-100">
              <BookOpen size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs relative z-10 font-medium">
            <span className="text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full font-bold">
              Hoạt động
            </span>
            <span className="text-gray-400 ml-2">trên hệ thống</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-555 uppercase tracking-wider mb-1">Doanh thu thực</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {loading ? '...' : formatPrice(stats.totalRevenue)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 backdrop-blur-sm border border-emerald-100">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs relative z-10 font-medium">
            <span className="text-green-650 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={14} className="mr-1"/> Hoàn thành
            </span>
            <span className="text-gray-400 ml-2">đã đối soát thành công</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-555 uppercase tracking-wider mb-1">Lớp đang mở</p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {loading ? '...' : stats.activeClasses}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-orange-600 backdrop-blur-sm border border-orange-100">
              <Activity size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs relative z-10 font-medium">
            <span className="text-orange-600 flex items-center bg-orange-50 px-2 py-0.5 rounded-full">
              Lớp học
            </span>
            <span className="text-gray-400 ml-2">sắp & đang diễn ra</span>
          </div>
        </div>
      </div>
      
      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Biểu đồ người dùng mới</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm font-medium text-gray-650 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="w-full h-72 bg-blue-50/30 rounded-xl border border-dashed border-blue-200 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')] opacity-30"></div>
            {newUsersSeries ? (
              <div className="w-full h-72">
                <Bar
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                  data={{
                    labels: newUsersSeries.labels,
                    datasets: [
                      {
                        label: 'Người dùng mới',
                        data: newUsersSeries.values,
                        backgroundColor: 'rgba(59,130,246,0.8)'
                      }
                    ]
                  }}
                />
              </div>
            ) : (
              <>
                <BarChart3 size={48} className="text-blue-300 mb-3 z-10" strokeWidth={1.5} />
                <span className="text-blue-500 font-medium z-10">Đang đồng bộ dữ liệu biểu đồ...</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Doanh thu theo tháng</h3>
            <button className="text-sm font-medium text-primary hover:text-red-700 transition-colors">Xem chi tiết</button>
          </div>
          <div className="w-full h-72 bg-emerald-50/30 rounded-xl border border-dashed border-emerald-200 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')] opacity-30"></div>
            {revenueSeries ? (
              <div className="w-full h-72">
                <Line
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                  data={{
                    labels: revenueSeries.labels,
                    datasets: [
                      {
                        label: 'Doanh thu',
                        data: revenueSeries.values,
                        borderColor: 'rgba(16,185,129,0.9)',
                        backgroundColor: 'rgba(16,185,129,0.2)'
                      }
                    ]
                  }}
                />
              </div>
            ) : (
              <>
                <LineChart size={48} className="text-emerald-300 mb-3 z-10" strokeWidth={1.5} />
                <span className="text-emerald-500 font-medium z-10">Đang tính toán dòng tiền...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
