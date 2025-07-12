import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedServices: 0,
    totalSpent: 0,
    avgRating: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9090/customer/bookings/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        const bookings = res.data;
        console.log('Fetched Bookings:', bookings);

        const sortedBookings = [...bookings].sort(
          (a, b) => new Date(b.date || b.bookedAt) - new Date(a.date || a.bookedAt)
        );

        setRecentBookings(sortedBookings.slice(0, 3));

        const completed = bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
        const totalSpent = completed.reduce((sum, b) => sum + (b.price || 0), 0);
        const avgRating = completed.length > 0
          ? (completed.reduce((sum, b) => sum + (b.rating || 0), 0) / completed.length).toFixed(1)
          : 0;

        setStats({
          activeBookings: bookings.filter(b => b.status?.toUpperCase() === 'PENDING').length,
          completedServices: completed.length,
          totalSpent,
          avgRating,
        });
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name || user?.firstName}!</h1>
            <p className="text-blue-100">Manage your bookings and discover new services</p>
          </div>
          <button
            onClick={logout}
            className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Active Bookings" value={stats.activeBookings} icon={<Calendar className="h-6 w-6 text-blue-600" />} bg="blue" />
          <StatsCard title="Completed" value={stats.completedServices} icon={<CheckCircle className="h-6 w-6 text-green-600" />} bg="green" />
          <StatsCard title="Total Spent" value={`₹${stats.totalSpent}`} icon={<TrendingUp className="h-6 w-6 text-orange-600" />} bg="orange" />
          <StatsCard title="Avg Rating" value={stats.avgRating} icon={<Star className="h-6 w-6 text-yellow-600" />} bg="yellow" />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.map((booking, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{booking.serviceName || booking.service?.category?.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{booking.providerName || `${booking.provider?.firstName} ${booking.provider?.lastName}`}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.providerEmail || booking.provider?.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{booking.providerPhone || booking.provider?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="p-6 text-gray-500 text-sm text-center">No bookings found.</div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, icon, bg }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`h-12 w-12 bg-${bg}-100 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export default UserDashboard;
