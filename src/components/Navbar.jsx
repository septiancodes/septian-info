import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t?.nav?.home || (lang === 'id' ? 'Beranda' : 'Home'), id: 'home', action: scrollToTop },
    { label: t?.nav?.about || (lang === 'id' ? 'Tentang' : 'About'), id: 'about' },
    { label: t?.nav?.work || (lang === 'id' ? 'Karya' : 'Work'), id: 'work' },
    { label: t?.nav?.services || (lang === 'id' ? 'Layanan' : 'Services'), id: 'services' },
    { label: t?.nav?.contact || (lang === 'id' ? 'Kontak' : 'Contact'), id: 'contact' },
  ];

  return (
    <>
      {/* Top Main Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full h-20 sm:h-24 z-40 transition-all duration-300 ${
          scrolled 
            ? isDark 
              ? 'bg-[#0d1116]/90 backdrop-blur-md border-b border-white/10 shadow-2xl' 
              : 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-lg'
            : isDark 
              ? 'bg-[#0d1116]/60 backdrop-blur-sm border-b border-white/5' 
              : 'bg-white/70 backdrop-blur-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="group flex items-center text-xl sm:text-2xl font-bold tracking-tighter hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className={`font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              SEPTIAN
            </span>
            <span className="text-[#00df8f] transition-transform duration-300 group-hover:scale-150 inline-block ml-0.5">
              .
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.action) link.action();
                  else if (link.id) scrollToSection(link.id);
                }}
                className={`text-xs lg:text-sm font-semibold tracking-widest uppercase transition-colors duration-300 relative group py-1 cursor-pointer ${
                  isDark ? 'text-gray-300 hover:text-[#00df8f]' : 'text-slate-600 hover:text-[#00b373]'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                  isDark ? 'bg-[#00df8f]' : 'bg-[#00b373]'
                }`} />
              </button>
            ))}
          </nav>

          {/* Desktop Controls (Language, Theme, Status) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher Capsule */}
            <div className={`flex items-center p-1 rounded-full border text-xs font-bold transition-all ${
              isDark ? 'bg-[#14181f] border-white/10' : 'bg-slate-100 border-slate-200 shadow-sm'
            }`}>
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[#00df8f] text-black font-extrabold shadow-sm'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#00df8f] text-black font-extrabold shadow-sm'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer ${
                isDark 
                  ? 'bg-[#14181f] border-white/10 text-amber-400 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400 hover:shadow-md'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Availability Status Dot */}
            <button
              onClick={() => scrollToSection('contact')}
              className={`group relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-[#14181f] border-white/10 hover:border-[#00df8f]/50 hover:shadow-[0_0_20px_rgba(0,223,143,0.25)]' 
                  : 'bg-slate-100 border-slate-200 hover:border-[#00b373]/50 hover:shadow-md'
              }`}
              title={t.nav.available}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df8f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00df8f]"></span>
              </span>
            </button>
          </div>

          {/* Mobile Right Trigger: Language Pill + Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLang}
              className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#14181f] border-white/15 text-[#00df8f]' 
                  : 'bg-slate-100 border-slate-200 text-[#00b373]'
              }`}
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isDark 
                  ? 'bg-[#14181f] border-white/15 text-white hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
              aria-label="Buka Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Exact Scaling Hamburger Navigation Popout (Simple & Clean) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[999] md:hidden">
            {/* Dark Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Scaling Card Popout anchored to Top-Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: 20, y: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, x: 20, y: -20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              style={{ transformOrigin: 'top right' }}
              className="absolute top-5 right-5 w-[260px] sm:w-[280px] rounded-3xl p-6 shadow-2xl z-10 border bg-[#eceeed] text-[#1c1d1f]"
            >
              {/* Header inside popup */}
              <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] font-mono tracking-widest uppercase text-gray-500 font-semibold">
                  MENU
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:text-black transition-colors cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Vertical Nav Links Stack */}
              <div className="py-2 flex flex-col space-y-1">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => {
                      if (link.action) link.action();
                      else if (link.id) scrollToSection(link.id);
                    }}
                    className="w-full flex items-center justify-between py-2 text-left cursor-pointer group transition-colors"
                  >
                    <span className={`text-[19px] font-bold tracking-tight font-display transition-colors ${
                      hoveredIdx === idx ? 'text-black font-extrabold' : 'text-gray-700 hover:text-black'
                    }`}>
                      {link.label}
                    </span>
                    {/* Small Dot Indicator */}
                    <span className={`w-1.5 h-1.5 rounded-full bg-black transition-all ${
                      hoveredIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`} />
                  </button>
                ))}
              </div>

              {/* Bottom Quick Controls (Language & Theme) */}
              <div className="pt-4 mt-2 border-t border-gray-300/80 flex items-center justify-between">
                {/* Language Switch */}
                <div className="flex items-center space-x-1 text-xs font-bold font-mono">
                  <button
                    onClick={() => setLang('id')}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      lang === 'id' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    ID
                  </button>
                  <span className="text-gray-400">/</span>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 transition-colors cursor-pointer"
                  title="Ganti Tema"
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
