import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { checkBackendHealth } from './services/api';

function AppContent() {
  const [backendHealth, setBackendHealth] = useState({
    status: 'CHECKING',
    data: null,
    error: null,
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar
        backendHealth={backendHealth}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                backendHealth={backendHealth}
                onRefreshHealth={fetchHealth}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            }
          />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
