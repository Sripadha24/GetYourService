import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/Dashboard/UserDashboard';
import ProviderDashboard from './pages/Dashboard/ProviderDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserBooking from './pages/User/Booking';
import UserHistory from './pages/User/History';
import UserProfile from './pages/User/Profile';
import UserReviews from './pages/User/Reviews';
import UserServices from './pages/User/Services';
import ProviderBooking from './pages/Provider/ProviderBooking';
import ProviderHistory from './pages/Provider/ProviderHistory';
import ProviderProfile from './pages/Provider/ProviderProfile';
import ProviderReviews from './pages/Provider/ProviderReviews';
import ProviderServices from './pages/Provider/ProviderServices';
import NotificationPopup from './components/NotificationPopup';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <NotificationPopup />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route path="/user/dashboard" element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/booking" element={
                <ProtectedRoute role="user">
                  <UserBooking />
                </ProtectedRoute>
              } />
              <Route path="/user/history" element={
                <ProtectedRoute role="user">
                  <UserHistory />
                </ProtectedRoute>
              } />
              <Route path="/user/profile" element={
                <ProtectedRoute role="user">
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/user/reviews" element={
                <ProtectedRoute role="user">
                  <UserReviews />
                </ProtectedRoute>
              } />
              <Route path="/user/services" element={
                <ProtectedRoute role="user">
                  <UserServices />
                </ProtectedRoute>
              } />

              {/* Provider Routes */}
              <Route path="/provider/dashboard" element={
                <ProtectedRoute role="provider">
                  <ProviderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/provider/booking" element={
                <ProtectedRoute role="provider">
                  <ProviderBooking />
                </ProtectedRoute>
              } />
              <Route path="/provider/history" element={
                <ProtectedRoute role="provider">
                  <ProviderHistory />
                </ProtectedRoute>
              } />
              <Route path="/provider/profile" element={
                <ProtectedRoute role="provider">
                  <ProviderProfile />
                </ProtectedRoute>
              } />
              <Route path="/provider/reviews" element={
                <ProtectedRoute role="provider">
                  <ProviderReviews />
                </ProtectedRoute>
              } />
              <Route path="/provider/services" element={
                <ProtectedRoute role="provider">
                  <ProviderServices />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;