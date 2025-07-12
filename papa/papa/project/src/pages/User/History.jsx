import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import axios from '../../axiosInstance';

const History = () => {
  const { addNotification } = useNotification();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [reviewForms, setReviewForms] = useState({}); // key: bookingId, value: { rating, comment }

  useEffect(() => {
    axios.get('/customer/bookings/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => setBookings(res.data))
      .catch(() => addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch booking history',
      }));
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReviewChange = (id, field, value) => {
    setReviewForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const submitReview = (bookingId) => {
    const review = reviewForms[bookingId];
    if (!review?.rating || !review?.comment) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill both rating and comment',
      });
      return;
    }

    axios.post(`/customer/${bookingId}/review`, review, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        addNotification({
          type: 'success',
          title: 'Review Submitted',
          message: 'Thank you for your feedback!',
        });
        setReviewForms(prev => ({ ...prev, [bookingId]: null }));
      })
      .catch(() => {
        addNotification({
          type: 'error',
          title: 'Failed to Submit',
          message: 'Please try again later.',
        });
      });
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Bookings" value={filteredBookings.length} icon={<Calendar className="h-8 w-8 text-blue-600" />} />
          <StatsCard title="Pending" value={filteredBookings.filter(b => b.status === 'PENDING').length} icon={<Clock className="h-8 w-8 text-yellow-600" />} />
          <StatsCard title="Total Spent" value="--" icon={<DollarSign className="h-8 w-8 text-orange-600" />} />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex space-x-2">
            {['all', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${filter === status.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
                  <p className="text-sm text-gray-600">Provider: {booking.providerName}</p>
                  <p className="text-sm text-gray-600">Phone: {booking.providerPhone}</p>
                  <p className="text-sm text-gray-600">Email: {booking.providerEmail}</p>
                </div>
                <span className={`mt-4 md:mt-0 px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {/* Show Review Form for Completed Bookings */}
              {booking.status === 'COMPLETED' && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Leave a Review</p>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Rating (1-5)"
                    value={reviewForms[booking.bookingId]?.rating || ''}
                    onChange={(e) => handleReviewChange(booking.bookingId, 'rating', Number(e.target.value))}
                    className="w-24 px-2 py-1 border rounded"
                  />
                  <textarea
                    rows={2}
                    placeholder="Write your feedback"
                    value={reviewForms[booking.bookingId]?.comment || ''}
                    onChange={(e) => handleReviewChange(booking.bookingId, 'comment', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => submitReview(booking.bookingId)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">You haven't made any bookings yet or none match the selected filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default History;
