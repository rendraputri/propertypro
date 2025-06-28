import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Premium Pages
import PremiumUpgradePage from './pages/PremiumUpgradePage';
import PremiumDashboardPage from './pages/PremiumDashboardPage';
import PremiumFeaturesPage from './pages/PremiumFeaturesPage';

// User Dashboard Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyListings from './pages/dashboard/MyListings';
import AddEditListing from './pages/dashboard/AddEditListing';
import ProfileSettings from './pages/dashboard/ProfileSettings';

// User Area Pages
import UserLayout from './components/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserProperties from './pages/user/UserProperties';

// Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PropertyManagement from './pages/admin/PropertyManagement';
import PremiumManagement from './pages/admin/PremiumManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import LocationManagement from './pages/admin/LocationManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import ModerationHistory from './pages/admin/ModerationHistory';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import UnauthorizedPage from './pages/admin/UnauthorizedPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/jual" element={<PropertyListingPage />} />
              <Route path="/sewa" element={<PropertyListingPage />} />
              <Route path="/properti/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Premium Routes */}
              <Route path="/premium/upgrade" element={<PremiumUpgradePage />} />
              <Route path="/premium/features" element={<PremiumFeaturesPage />} />

              {/* User Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardOverview />} />
                <Route path="listings" element={<MyListings />} />
                <Route path="listings/new" element={<AddEditListing />} />
                <Route path="listings/edit/:id" element={<AddEditListing />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="premium" element={<PremiumDashboardPage />} />
              </Route>

              {/* User Area Routes */}
              <Route path="/user" element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="properties" element={<UserProperties />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
              
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="properties" element={<PropertyManagement />} />
                <Route path="premium" element={<PremiumManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="locations" element={<LocationManagement />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="moderation-history" element={<ModerationHistory />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;