import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import { NotFound404 } from './pages/Errors';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-ivory dark:bg-deepCharcoal flex items-center justify-center font-mono text-sm text-warmGray">[ SYSTEM INITIALIZING... ]</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-ivory dark:bg-deepCharcoal flex items-center justify-center font-mono text-sm text-warmGray">[ SYSTEM INITIALIZING... ]</div>;
  if (user) return <Navigate to="/chat" replace />;
  return children;
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('nexora_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nexora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nexora_theme', 'light');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage darkMode={darkMode} setDarkMode={setDarkMode} /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login darkMode={darkMode} setDarkMode={setDarkMode} /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup darkMode={darkMode} setDarkMode={setDarkMode} /></PublicRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
