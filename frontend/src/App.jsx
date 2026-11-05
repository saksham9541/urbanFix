import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AuthModal from './components/AuthModal';
import ReportIssueModal from './components/ReportIssueModal';
import TrackIssueModal from './components/TrackIssueModal';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { checkBackendHealth } from './services/api';

function AppContent() {
  const [backendHealth, setBackendHealth] = useState({
    status: 'CHECKING',
    data: null,
    error: null,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(
    localStorage.getItem('urbanfix_last_ticket') || 'UF-2026-10001'
  );

  const fetchHealth = async () => {
    const result = await checkBackendHealth();
    if (result.success) {
      setBackendHealth({ status: 'UP', data: result.data, error: null });
    } else {
      setBackendHealth({ status: 'DOWN', data: null, error: result.error });
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenTrack = (trackingNumber) => {
    const target = trackingNumber || localStorage.getItem('urbanfix_last_ticket') || 'UF-2026-10001';
    setActiveTrackingNumber(target);
    setIsTrackModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar
        backendHealth={backendHealth}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenTrack={handleOpenTrack}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* 1. Public Landing Page */}
          <Route
            path="/"
            element={
              <LandingPage
                onOpenReport={() => setIsReportModalOpen(true)}
                onOpenTrack={handleOpenTrack}
              />
            }
          />

          {/* 2. Dedicated Authorization / Sign In Page */}
          <Route
            path="/auth"
            element={<AuthPage />}
          />

          {/* 3. Operations Portal & Dashboard ("All the rest") */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                backendHealth={backendHealth}
                onRefreshHealth={fetchHealth}
                onOpenReport={() => setIsReportModalOpen(true)}
                onOpenTrack={handleOpenTrack}
              />
            }
          />

          {/* Fallback alias */}
          <Route path="/portal" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onComplaintCreated={(newComplaint) => {
          if (newComplaint?.trackingNumber) {
            localStorage.setItem('urbanfix_last_ticket', newComplaint.trackingNumber);
            handleOpenTrack(newComplaint.trackingNumber);
          }
        }}
      />

      <TrackIssueModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialTrackingNumber={activeTrackingNumber}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <AppContent />
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}
