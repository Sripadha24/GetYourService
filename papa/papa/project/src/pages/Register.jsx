import React, { useState } from 'react';
import axios from 'axios'; // use basic axios to isolate bug
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useNotification } from '../context/NotificationContext';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Phone, Home, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  // const { addNotification } = useNotification();

  const rawRole = location.state?.selectedRole || 'user';
  const selectedRole = rawRole === 'provider' ? 'SERVICEPROVIDER' : 'USER';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // addNotification({ type: 'error', title: 'Error', message: 'Passwords do not match' });
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:9090/auth/register', {
        ...formData,
        role: selectedRole
      });

      // addNotification({
      //   type: 'success',
      //   title: 'Success',
      //   message: `Registered successfully as ${rawRole}!`
      // });
      alert(`Registered successfully as ${rawRole}`);
      navigate('/login', { state: { selectedRole: rawRole } });
    } catch (err) {
      // addNotification({
      //   type: 'error',
      //   title: 'Registration Failed',
      //   message: err.response?.data?.message || 'Could not create account'
      // });
      alert(err.response?.data?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const Input = ({ name, label, icon: Icon, type = 'text' }) => (
    <div>
      <label className="block text-sm text-blue-100 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/80"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-blue-100">
                Registering as: <span className="uppercase">{selectedRole === 'SERVICEPROVIDER' ? 'PROVIDER' : 'USER'}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input name="firstName" label="First Name" icon={User} />
              <Input name="lastName" label="Last Name" icon={User} />
              <Input name="email" label="Email" icon={Mail} type="email" />
              <Input name="phone" label="Phone" icon={Phone} />
              <Input name="address" label="Address" icon={Home} />

              <div>
                <label className="block text-sm text-blue-100 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-blue-100 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-blue-100">
              Already have an account?{' '}
              <Link to="/login" state={{ selectedRole: rawRole }} className="text-cyan-300 hover:text-white font-medium">
                Sign In
              </Link>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/role-selection')}
                className="text-blue-200 hover:text-white flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Role Selection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
