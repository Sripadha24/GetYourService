import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from '../../axiosInstance';
import {
  Calendar,
  DollarSign,
  Star,
  Clock,
  User,
  TrendingUp,
} from 'lucide-react';

const ProviderHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/serviceprovider/booking/history');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const totalEarnings = completedBookings.length * 100; // You can use actual price if API gives it
  const avgRating = 4.8; // Replace with actual logic when ratings are available
  const totalHours = completedBookings.length * 2; // Replace with actual duration if provided

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service History</h1>
          <p className="text-gray-600 mt-1">Track your completed services and earnings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Earnings" value={`$${totalEarnings}`} Icon={DollarSign} color="green" />
          <Card title="Completed Jobs" value={completedBookings.length} Icon={Calendar} color="blue" />
          <Card title="Average Rating" value={avgRating.toFixed(1)} Icon={Star} color="yellow" />
          <Card title="Total Hours" value={totalHours.toFixed(1)} Icon={Clock} color="purple" />
        </div>

        {/* Completed Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Completed Services</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="p-6 text-gray-500">Loading...</p>
            ) : completedBookings.length === 0 ? (
              <p className="p-6 text-gray-500">No completed bookings available.</p>
            ) : (
              completedBookings.map(booking => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{booking.serviceCategory}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <Info label="Customer" value={booking.customerName} Icon={User} />
                        <Info label="Date" value={new Date(booking.bookedAt).toLocaleDateString()} Icon={Calendar} />
                        <Info label="Duration" value="2 hrs" Icon={Clock} /> {/* Placeholder */}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600 mb-1">${100}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span> {/* Placeholder */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Card = ({ title, value, Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <Icon className={`h-8 w-8 text-${color}-600`} />
    </div>
  </div>
);

const Info = ({ label, value, Icon }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <Icon className="h-4 w-4" />
    <span>{value}</span>
  </div>
);

export default ProviderHistory;
