import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, Phone, LogIn, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-gray-900/60 to-blue-900/60 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Settings className="h-7 w-7 text-white" />
            <span className="text-lg font-bold">GetYourService</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-400 transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="#about" className="flex items-center space-x-1 hover:text-blue-400 transition">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link to="#contacts" className="flex items-center space-x-1 hover:text-blue-400 transition">
              <Phone className="h-4 w-4" />
              <span>Contacts</span>
            </Link>
            <button
              onClick={() => navigate('/role-selection')}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => navigate('/role-selection')}
              className="bg-blue-600 p-2 rounded-md hover:bg-blue-500 transition"
            >
              <LogIn className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
