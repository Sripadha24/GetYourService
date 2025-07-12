import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { MapPin, CreditCard } from 'lucide-react';
import axios from '../../axiosInstance';

const Booking = () => {
  const location = useLocation();
  const { addNotification } = useNotification();

  const { service, provider, coords } = location.state || {};

  const [bookingData, setBookingData] = useState({
    serviceId: service?.id || '',
    customerLat: coords?.lat || '',
    customerLong: coords?.long || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customer/bookings', bookingData);
      addNotification({
        type: 'success',
        title: 'Booking Successful',
        message: 'Your booking has been submitted!'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: err.response?.data?.message || 'Could not submit booking'
      });
    }
  };

  if (!service || !provider) {
    return (
      <DashboardLayout role="user">
        <div className="p-6">
          <p className="text-red-600">Missing booking details. Please go back and select a service again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Confirm Your Booking</h1>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-2">{service.category.name}</h2>
          <p className="text-gray-700 mb-1">Provider: {provider.firstName} {provider.lastName}</p>
          <p className="text-gray-600">Distance: {(location.state?.distance || 0).toFixed(2)} km</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location: {bookingData.customerLat}, {bookingData.customerLong}
            </div>
            <div className="text-sm text-gray-600">
              <CreditCard className="inline h-4 w-4 mr-1" />
              Payment upon completion
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Booking;
