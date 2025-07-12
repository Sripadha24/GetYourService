import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import axios from '../../axiosInstance';
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Check,
  X,
} from 'lucide-react';

const ProviderBooking = () => {
  const { addNotification } = useNotification();
  const [filter, setFilter] = useState('PENDING');
  const [bookings, setBookings] = useState([]);
  const [directionsMap, setDirectionsMap] = useState({});

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/serviceprovider/booking/history');
      setBookings(res.data);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Fetch Failed',
        message: err.response?.data?.message || 'Could not fetch bookings.',
      });
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await axios.post(`/serviceprovider/booking/${bookingId}/${action}`);

      if (action === 'accept') {
        const res = await axios.get(`/serviceprovider/provider/directions/${bookingId}`);
        setDirectionsMap(prev => ({ ...prev, [bookingId]: res.data.directionsUrl }));
      }

      addNotification({
        type: 'success',
        title: `Booking ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
        message: `Booking ID ${bookingId} has been ${action}ed.`,
      });

      fetchBookings();
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: err.response?.data?.message || 'Could not update booking status.',
      });
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await axios.post(`/serviceprovider/booking/${bookingId}/completed`);
      addNotification({
        type: 'success',
        title: 'Booking Completed',
        message: `Booking ID ${bookingId} marked as completed.`,
      });
      fetchBookings();
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Completion Failed',
        message: err.response?.data?.message || 'Could not complete booking.',
      });
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    filter === 'ALL' ? true : booking.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            {['PENDING', 'ACCEPTED', 'COMPLETED', 'ALL'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${filter === status
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {filter === 'PENDING'
                ? 'No pending booking requests at the moment.'
                : `No ${filter.toLowerCase()} bookings to display.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Booking ID #{booking.id}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p><User className="inline w-4 h-4 mr-1" /> {booking.customerName}</p>
                    <p><Phone className="inline w-4 h-4 mr-1" /> {booking.customerPhone}</p>
                    <p><Mail className="inline w-4 h-4 mr-1" /> {booking.customerEmail}</p>
                  </div>
                  <div>
                    <p><Calendar className="inline w-4 h-4 mr-1" /> Booked At: {new Date(booking.bookedAt).toLocaleString()}</p>
                    <p><MapPin className="inline w-4 h-4 mr-1" /> Service: {booking.serviceCategory}</p>
                    <p>Description: {booking.serviceDescription || 'N/A'}</p>
                  </div>
                </div>

                {booking.status === 'PENDING' && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleBookingAction(booking.id, 'reject')}
                      className="flex items-center space-x-1 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <X className="w-4 h-4" /> <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(booking.id, 'accept')}
                      className="flex items-center space-x-1 px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                    >
                      <Check className="w-4 h-4" /> <span>Accept</span>
                    </button>
                  </div>
                )}

                {booking.status === 'ACCEPTED' && (
                  <div className="flex justify-end space-x-2 mt-4">
                    {directionsMap[booking.id] ? (
                      <a
                        href={directionsMap[booking.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        <MapPin className="w-4 h-4" /> <span>Get Directions</span>
                      </a>
                    ) : (
                      <button
                        onClick={async () => {
                          const res = await axios.get(`/serviceprovider/provider/directions/${booking.id}`);
                          setDirectionsMap(prev => ({ ...prev, [booking.id]: res.data.directionsUrl }));
                        }}
                        className="flex items-center space-x-1 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        <MapPin className="w-4 h-4" /> <span>Get Directions</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="flex items-center space-x-1 px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                    >
                      <Check className="w-4 h-4" /> <span>Mark as Completed</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderBooking;
