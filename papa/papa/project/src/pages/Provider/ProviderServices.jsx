import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { PlusCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Switch } from '@headlessui/react';

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const fetchServices = async () => {
    try {
      const res = await axios.get('/serviceprovider/services');
      setServices(res.data);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Failed to Fetch Services',
        message: err.response?.data?.message || 'Try again later',
      });
    }
  };

  const handleAddService = async () => {
    if (!description || !categoryId) return;

    try {
      setLoading(true);
      const res = await axios.post('/serviceprovider/post', {
        category: { id: categoryId },
        description,
      });

      setDescription('');
      setCategoryId(1);
      addNotification({
        type: 'success',
        title: 'Service Posted',
        message: `Service ID ${res.data.id} created`,
      });
      fetchServices();
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Post Failed',
        message: err.response?.data?.message || 'Error posting service',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (serviceId, availability) => {
    try {
      await axios.put('/serviceprovider/update', { availability });
      addNotification({
        type: 'success',
        title: 'Availability Updated',
        message: `Service ${serviceId} is now ${availability ? 'Available' : 'Unavailable'}`,
      });
      fetchServices();
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || 'Could not update availability',
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <DashboardLayout role="provider">
      <div className="max-w-4xl mx-auto space-y-10 px-4 py-6">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-green-600" />
            Post a New Service
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
              <input
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter category ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter service description"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleAddService}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Posting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Post Service
                </span>
              )}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Posted Services</h3>

          {services.length === 0 ? (
            <p className="text-gray-500 text-lg italic">No services posted yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition duration-300"
                >
                  <h4 className="text-lg font-bold text-blue-800 mb-1">Service ID: {s.id}</h4>
                  <p className="text-gray-700"><strong>Category:</strong> {s.category?.name || 'N/A'}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {s.description || 'No description'}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-700 font-semibold">Available:</span>
                    <Switch
                      checked={s.availability}
                      onChange={(newValue) => handleToggleAvailability(s.id, newValue)}
                      className={`${s.availability ? 'bg-green-500' : 'bg-gray-300'
                        } relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                    >
                      <span
                        className={`${s.availability ? 'translate-x-5' : 'translate-x-0'
                          } inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderServices;
