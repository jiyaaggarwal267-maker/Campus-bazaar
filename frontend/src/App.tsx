import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';
import { useEffect } from 'react';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import VerifyEmail from '@/pages/VerifyEmail';
import CompleteProfile from '@/pages/CompleteProfile';
import Browse from '@/pages/Browse';
import ProductDetail from '@/pages/ProductDetail';
import ChatList from '@/pages/ChatList';
import ChatRoom from '@/pages/ChatRoom';
import Dashboard from '@/pages/Dashboard';
import Notifications from '@/pages/Notifications';
import CreateListing from '@/pages/CreateListing';
import MyListings from '@/pages/MyListings';
import PublicProfile from '@/pages/PublicProfile';

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-500">Loading…</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={
          <ProtectedRoute requireVerified={false}><VerifyEmail /></ProtectedRoute>} />
        <Route path="/complete-profile" element={
          <ProtectedRoute requireVerified={false}><CompleteProfile /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
              <AppContent />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
