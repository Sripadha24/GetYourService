import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, DollarSign, Star, Users, TrendingUp, Clock } from 'lucide-react';
import axios from '../../axiosInstance';
import { useNotification } from '../../context/NotificationContext';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [stats, setStats] = useState({
    pendingBookings: 0,
    monthlyEarnings: 0,
    avgRating: 0,
    totalCustomers: 0
  });

  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, earningsRes] = await Promise.all([
        axios.get('/serviceprovider/booking/history'),
        axios.get('/serviceprovider/earnings')
      ]);

      const allBookings = bookingsRes.data || [];
      const pending = allBookings.filter(b => b.status === 'PENDING');

      setStats({
        pendingBookings: pending.length,
        monthlyEarnings: earningsRes.data?.monthlyEarnings || 0,
        avgRating: earningsRes.data?.avgRating || 0,
        totalCustomers: earningsRes.data?.totalCustomers || 0
      });

      setPendingBookings(pending);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error loading dashboard',
        message: err.response?.data?.message || 'Failed to fetch provider data.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardLayout role="provider"><div className="p-6">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Provider'}!</h1>
          <p className="text-green-100">Manage your services and grow your business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Pending Bookings" value={stats.pendingBookings} icon={<Clock className="h-6 w-6 text-orange-600" />} bg="bg-orange-100" />
          <StatCard label="Monthly Earnings" value={`$${stats.monthlyEarnings}`} icon={<DollarSign className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
          <StatCard label="Rating" value={stats.avgRating} icon={<Star className="h-6 w-6 text-yellow-600" />} bg="bg-yellow-100" />
          <StatCard label="Total Customers" value={stats.totalCustomers} icon={<Users className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Pending Bookings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingBookings.length === 0 ? (
              <div className="p-6 text-gray-500">No pending bookings at the moment.</div>
            ) : pendingBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{booking.serviceCategory}</h3>
                    <p className="text-gray-600 mt-1">Customer: {booking.customerName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                      </div>
                      <span className="font-medium">{booking.price ? `$${booking.price}` : ''}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{booking.location || 'N/A'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                      Accept
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <QuickAction icon={<Calendar className="h-5 w-5 text-blue-600" />} text="View All Bookings" />
              <QuickAction icon={<TrendingUp className="h-5 w-5 text-green-600" />} text="Update Services" />
              <QuickAction icon={<Star className="h-5 w-5 text-yellow-600" />} text="View Reviews" />
            </div>
          </div>

          {/* Static Reviews Placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">"Excellent service, very professional!"</p>
                  <p className="text-xs text-gray-500 mt-1">- Customer {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Reusable Components
const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`h-12 w-12 ${bg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

const QuickAction = ({ icon, text }) => (
  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
    {icon}
    <span>{text}</span>
  </button>
);

export default ProviderDashboard;
