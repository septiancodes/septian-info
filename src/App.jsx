import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import RecentWorks from './components/RecentWorks';
import Services from './components/Services';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function checkIsAdminPath() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/setting' ||
    path === '/settings' ||
    path === '/admin' ||
    hash === '#setting' ||
    hash === '#settings' ||
    hash === '#admin'
  );
}

function PortfolioMain() {
  return (
    <div className="min-h-screen bg-[#0d1116] text-white selection:bg-[#00df8f] selection:text-black font-sans relative transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <About />
        <RecentWorks />
        <Services />
      </main>
      <Footer />
    </div>
  );
}

function MainApp() {
  const [isAdminView, setIsAdminView] = useState(checkIsAdminPath);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('admin_token');
  });
  const { reloadPortfolioData } = useLanguage();

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(checkIsAdminPath());
    };

    // Keyboard shortcuts: Ctrl + Shift + A or Ctrl + Shift + S
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsAdminView(prev => !prev);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBackToSite = () => {
    setIsAdminView(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.location.hash = '';
    reloadPortfolioData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.location.hash = '';
    reloadPortfolioData();
  };

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToSite={handleBackToSite}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToSite={handleBackToSite}
        onLogout={handleLogout}
      />
    );
  }

  return <PortfolioMain />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
