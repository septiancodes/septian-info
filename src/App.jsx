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
import { Settings } from 'lucide-react';

function PortfolioMain({ onOpenAdmin }) {
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

      {/* Floating Admin Button (Bottom Right) */}
      <button
        onClick={onOpenAdmin}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#14181f]/80 hover:bg-[#00df8f] text-gray-400 hover:text-black border border-white/10 hover:border-[#00df8f] backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer group"
        title="Buka Admin CMS (Ctrl+Shift+A)"
      >
        <Settings size={18} className="transition-transform group-hover:rotate-90 duration-500" />
      </button>
    </div>
  );
}

function MainApp() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('admin_token');
  });
  const { reloadPortfolioData } = useLanguage();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminView(true);
      }
    };

    // Keyboard shortcut Ctrl + Shift + A
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminView(prev => !prev);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleBackToSite = () => {
    setIsAdminView(false);
    window.location.hash = '';
    reloadPortfolioData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
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

  return <PortfolioMain onOpenAdmin={handleOpenAdmin} />;
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

