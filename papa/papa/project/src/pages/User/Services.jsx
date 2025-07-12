import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, MapPin } from 'lucide-react';
import axios from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const Services = () => {
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Services' }]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [coords, setCoords] = useState({ lat: null, long: null });

  // Fetch categories
  useEffect(() => {
    axios.get('http://localhost:9090/getallcategory')
      .then(res => {
        const unique = res.data.filter(c => !categories.find(prev => prev.id === c.id));
        setCategories(prev => [...prev, ...unique]);
      })
      .catch(() => addNotification({ type: 'error', title: 'Error', message: 'Failed to load categories' }));
  }, []);

  // Fetch services when coords change
  useEffect(() => {
    if (coords.lat == null) return;

    console.log("📍 Sending coords to backend: ", coords);
    axios.post('/customer/services', {
      customerLat: coords.lat,
      customerLong: coords.long
    })
      .then(res => {
        console.log("🛠️ Services fetched: ", res.data);
        setServices(res.data);
      })
      .catch(() => addNotification({ type: 'error', title: 'Error', message: 'Failed to fetch services' }));
  }, [coords]);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      addNotification({ type: 'error', title: 'Error', message: 'Geolocation not supported' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log("📌 Location fetched:", coords.latitude, coords.longitude);
        setCoords({ lat: coords.latitude, long: coords.longitude });
        setLocationAllowed(true);
      },
      () => {
        addNotification({ type: 'error', title: 'Permission Denied', message: 'Allow location access' });
      }
    );
  };

  const handleBook = async (svc) => {
    try {
      const [servRes, providerRes] = await Promise.all([
        axios.get(`http://localhost:9090/customer/getservice?id=${svc.service.id}`),
        axios.get(`http://localhost:9090/customer/getprovider?id=${svc.service.id}`)
      ]);
      navigate('/user/booking', {
        state: { service: servRes.data, provider: providerRes.data, coords }
      });
    } catch {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to fetch service details' });
    }
  };

  const filtered = services.filter(s => {
    const description = s.service.description || '';
    const matchesSearch = description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.service.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Find Services</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border rounded w-full"
            />
          </div>
          <button
            onClick={handleLocationClick}
            className="flex items-center justify-center px-4 py-3 border rounded text-gray-700 hover:bg-gray-100"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {locationAllowed ? 'Location Set' : 'My Location'}
          </button>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border rounded"
          >
            {categories.map(c => (
              <option key={c.id === 'all' ? 'all' : `cat-${c.id}`} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-600">{filtered.length} services found</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, index) => (
            <div key={s.service.id || index} className="bg-white border rounded shadow hover:shadow-md transition">
              <div className="p-4">
                <h3 className="font-semibold">{s.service.category.name}</h3>
                <p className="text-sm text-gray-600">{s.service.description || 'No description provided.'}</p>
                <div className="text-sm text-gray-500 mb-4">
                  Distance: {s.distance.toFixed(2)} km
                </div>
                <button
                  onClick={() => handleBook(s)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-gray-500">No services found</p>}
      </div>
    </DashboardLayout>
  );
};

export default Services;
