import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'user',
      title: 'Customer',
      description: 'Book services from trusted providers in your area',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Browse Services',
        'Book Appointments',
        'Leave Reviews',
        'Track History'
      ]
    },
    {
      id: 'provider',
      title: 'Service Provider',
      description: 'Offer your services and grow your business',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Manage Bookings',
        'Set Availability',
        'Build Reputation',
        'Grow Income'
      ]
    }
  ];

  const handleNavigate = (role, type) => {
    navigate(`/${type}`, { state: { selectedRole: role } });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-blue-900/80"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Role
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Select how you'd like to use ServiceHub to get started with the right experience for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <role.icon className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{role.title}</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">{role.description}</p>

                <div className="space-y-2 mb-8">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-center text-blue-200 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => handleNavigate(role.id.toUpperCase(), 'register')}
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 px-4 rounded-full font-medium transition-all"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => handleNavigate(role.id.toUpperCase(), 'login')}
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 px-4 rounded-full font-medium transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="text-blue-200 hover:text-white transition-colors duration-200 underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
