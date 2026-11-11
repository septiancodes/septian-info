import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowDownRight, Download, FileText, RotateCw, Building2, Mail, Globe, 
  MapPin, CheckCircle2, ShieldCheck, Cpu, ExternalLink, QrCode, Sparkles,
  Smartphone, Server, HardDrive, GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { isDark } = useTheme();
  const { t, profile } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toggleFlip = (e) => {
    if (e) e.stopPropagation();
    setIsFlipped(prev => !prev);
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setIsFlipped(prev => !prev);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Motion values for real-time drag position
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs for lanyard responsiveness
  const cardX = useSpring(rawX, { stiffness: 450, damping: 26 });
  const cardY = useSpring(rawY, { stiffness: 450, damping: 26 });

  // Realistic pendulum rotation around the top lanyard anchor
  const cardRotate = useTransform(cardX, [-200, 0, 200], [14, 0, -14]);
  const cardRotateY = useTransform(cardX, [-200, 0, 200], [-10, 0, 10]);
  const cardRotateX = useTransform(cardY, [-120, 0, 120], [8, 0, -8]);

  // Dynamic SVG lanyard path calculations
  const strapPath = useTransform([cardX, cardY], ([x, y]) => {
    const anchorX = 180;
    const anchorY = 0;
    const attachX = 180 + x;
    const attachY = 140 + y;

    const ctrlX1 = anchorX + x * 0.25;
    const ctrlY1 = anchorY + (attachY - anchorY) * 0.45;
    
    const ctrlX2 = anchorX + x * 0.75;
    const ctrlY2 = anchorY + (attachY - anchorY) * 0.85;

    return `M ${anchorX - 10} ${anchorY} 
            C ${ctrlX1 - 10} ${ctrlY1}, ${ctrlX2 - 10} ${ctrlY2}, ${attachX - 10} ${attachY} 
            L ${attachX + 10} ${attachY} 
            C ${ctrlX2 + 10} ${ctrlY2}, ${ctrlX1 + 10} ${ctrlY1}, ${anchorX + 10} ${anchorY} Z`;
  });

  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-grid-pattern transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116]' : 'bg-[#f8fafc]'
    }`}>
      {/* Massive Background Typography Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className={`text-[20vw] font-black tracking-tighter leading-none uppercase font-display ${
          isDark ? 'text-white opacity-[0.02]' : 'text-slate-900 opacity-[0.03]'
        }`}>
          DESIGN
        </h1>
      </div>

      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00df8f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-[#00df8f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-start"
          >
            {/* Subheading Badge */}
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border mb-6 ${
              isDark ? 'bg-[#14181f] border-white/10 text-gray-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}>
              <span className="w-2 h-2 rounded-full bg-[#00df8f] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase">
                {t.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] font-display mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t.hero.headingTitle1}{' '}
              <span className="block mt-1">
                <span 
                  className="text-transparent" 
                  style={{ WebkitTextStroke: isDark ? '2px #00df8f' : '2px #00b373' }}
                >
                  {t.hero.headingTitle2}
                </span>
                <span className="text-[#00df8f]">.</span>
              </span>
            </h1>

            {/* Intro Paragraph */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-sans ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}>
              {t.hero.intro}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                onClick={() => scrollToSection('work')}
                className="group relative inline-flex items-center justify-center px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-[#00df8f] to-[#00b373] text-black font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,223,143,0.4)] cursor-pointer"
              >
                <span>{t.hero.ctaWork}</span>
                <div className="ml-2 w-6 h-6 rounded-full bg-black/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
                  <ArrowDownRight size={16} className="text-black" />
                </div>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Secondary CTA: Contact */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`flex-1 sm:flex-none group inline-flex items-center justify-center px-5 sm:px-6 py-3.5 rounded-full border font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isDark 
                      ? 'bg-[#14181f] border-white/10 text-white hover:border-[#00df8f]/50 hover:bg-[#1a202a]' 
                      : 'bg-white border-slate-300 text-slate-800 hover:border-[#00b373] hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00df8f] mr-2 group-hover:scale-125 transition-transform" />
                  <span>{t.hero.ctaContact}</span>
                </button>

                {/* Tertiary CTA: Download CV */}
                <a
                  href={profile?.cvUrl || '/CV_Septian.pdf'}
                  download="CV_Septian_SKom.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 sm:flex-none group inline-flex items-center justify-center space-x-1.5 px-4 sm:px-5 py-3.5 rounded-full border font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:text-[#00df8f] hover:border-[#00df8f]/40' 
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-[#00b373] hover:border-[#00b373]/50'
                  }`}
                >
                  <Download size={15} className="text-[#00df8f] transition-transform group-hover:-translate-y-0.5" />
                  <span>{t.hero.ctaCv || 'CV'}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive ID Card Badge with Elastic Lanyard */}
          <div className="relative flex justify-center items-center mt-12 sm:mt-16 lg:mt-0 pt-10 sm:pt-12 lg:pt-0 perspective-1000">
            {/* Gentle Idle Pendulum Sway Wrapper */}
            <motion.div
              animate={{
                rotateZ: [-2.5, 2.5, -2.5],
                x: [-4, 4, -4],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transformOrigin: '50% -140px', // Pivots from the top lanyard hook
              }}
              className="relative flex justify-center items-center"
            >
              {/* Top Ceiling Anchor / Lanyard Hook Fixture */}
              <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-full border border-white/20 shadow-lg z-10" />

              {/* SVG Canvas for Stretchy Elastic Lanyard */}
              <svg
                className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[280px] sm:w-[360px] h-[260px] sm:h-[320px] pointer-events-none z-10 overflow-visible"
                viewBox="0 0 360 320"
              >
                <defs>
                  <linearGradient id="strapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? '#1e2430' : '#475569'} />
                    <stop offset="50%" stopColor={isDark ? '#14181f' : '#334155'} />
                    <stop offset="100%" stopColor={isDark ? '#0d1116' : '#1e293b'} />
                  </linearGradient>
                </defs>

                {/* Dynamic Stretchy Lanyard Ribbon */}
                <motion.path
                  d={strapPath}
                  fill="url(#strapGrad)"
                  stroke={isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Draggable Card Badge Container */}
              <motion.div
                drag
                dragSnapToOrigin={true}
                dragElastic={0.65}
                dragConstraints={{ left: -160, right: 160, top: -100, bottom: 160 }}
                dragTransition={{ bounceStiffness: 450, bounceDamping: 20 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setTimeout(() => setIsDragging(false), 80)}
                onClick={handleCardClick}
                style={{
                  x: rawX,
                  y: rawY,
                  rotateZ: cardRotate,
                  rotateY: cardRotateY,
                  rotateX: cardRotateX,
                  transformOrigin: '50% 0px', // Pin pivot to the top lanyard ring
                  transformPerspective: 1000,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ cursor: 'grabbing', scale: 0.98 }}
                className="relative w-[88vw] max-w-[335px] sm:max-w-sm cursor-grab z-20 group select-none [perspective:1000px]"
              >
                {/* 3D Flip Card Wrapper */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="relative w-full [transform-style:preserve-3d]"
                >
                  {/* ================= FRONT FACE ================= */}
                  <div
                    className={`w-full rounded-2xl sm:rounded-3xl border p-4 sm:p-5 backdrop-blur-xl transition-colors duration-300 [backface-visibility:hidden] ${
                      isDark 
                        ? 'bg-[#14181f] border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]' 
                        : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    {/* Metallic Ring Connector */}
                    <div className="w-10 sm:w-12 h-2.5 sm:h-3 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 rounded-full mx-auto -mt-2 sm:-mt-3 mb-3 sm:mb-4 border border-white/20 flex items-center justify-center shadow-md">
                      <div className="w-5 sm:w-6 h-1 bg-black/70 rounded-full" />
                    </div>

                    {/* ID Badge Header */}
                    <div className={`flex items-center justify-between border-b pb-3 mb-3.5 ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00df8f] animate-pulse" />
                        <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase font-display ${
                          isDark ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {t.hero.idBadge}
                        </span>
                      </div>
                      
                      {/* Interactive Flip Button */}
                      <button
                        onClick={toggleFlip}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                          isDark 
                            ? 'bg-white/5 hover:bg-[#00df8f] text-gray-300 hover:text-black border border-white/10 hover:border-[#00df8f]' 
                            : 'bg-slate-100 hover:bg-[#00b373] text-slate-700 hover:text-white border border-slate-300'
                        }`}
                        title="Klik untuk membalik dan melihat kartu nama"
                      >
                        <RotateCw size={11} className="transition-transform group-hover:rotate-180 duration-500 text-[#00df8f] group-hover:text-black" />
                        <span>DETAIL KARTU</span>
                      </button>
                    </div>

                    {/* Avatar Image Frame */}
                    <div className={`relative aspect-[4/3.8] sm:aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 border bg-gradient-to-b group-hover:border-[#00df8f]/40 transition-colors ${
                      isDark ? 'border-white/10 from-[#1f2530] to-[#0d1116]' : 'border-slate-200 from-slate-100 to-slate-200'
                    }`}>
                      <img
                        src={profile?.photoUrl || '/foto-saya.jpg'}
                        alt={`${profile?.name || 'Septian'} Portrait`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 pointer-events-none"
                      />
                      
                      {/* Grid Overlay on Image */}
                      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

                      {/* Bottom Dark Gradient Text Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1116] via-[#0d1116]/85 to-transparent p-3.5 sm:p-5 pt-8 sm:pt-12">
                        <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight font-display flex items-center">
                          {profile?.name || 'Septian'}{profile?.degree ? `, ${profile.degree}` : ''}<span className="text-[#00df8f]">.</span>
                        </h3>
                        <p className="text-[10px] sm:text-xs font-semibold text-[#00df8f] tracking-widest uppercase mt-0.5">
                          {t.hero.badge}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Specs */}
                    <div className={`grid grid-cols-3 gap-1.5 sm:gap-2 text-center pt-1 border-t ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <span className={`block text-[8px] sm:text-[10px] uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{t.hero.roleLabel}</span>
                        <span className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{t.hero.roleValue}</span>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <span className={`block text-[8px] sm:text-[10px] uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{t.hero.expLabel}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-[#00df8f] truncate block">{t.hero.expValue}</span>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <span className={`block text-[8px] sm:text-[10px] uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{t.hero.statusLabel}</span>
                        <span className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{t.hero.statusValue}</span>
                      </div>
                    </div>

                    {/* Drag & Flip Hint */}
                    <div className="mt-2.5 sm:mt-3.5 text-center">
                      <span className={`text-[9px] sm:text-[10px] tracking-wider font-mono flex items-center justify-center space-x-1 ${
                        isDark ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        <RotateCw size={11} className="text-[#00df8f] animate-spin mr-1" style={{ animationDuration: '6s' }} />
                        <span className="text-[#00df8f] font-semibold">KLIK</span> UNTUK BALIK KARTU • <span className="opacity-70">TARIK UNTUK MENGAYUN</span>
                      </span>
                    </div>
                  </div>

                  {/* ================= BACK FACE (KARTU NAMA & DETAIL KERJAAN) ================= */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl border p-4 sm:p-5 backdrop-blur-xl transition-colors duration-300 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between overflow-hidden ${
                      isDark 
                        ? 'bg-[#14181f] border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]' 
                        : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    {/* Metallic Ring Connector */}
                    <div className="w-10 sm:w-12 h-2.5 sm:h-3 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 rounded-full mx-auto -mt-2 sm:-mt-3 mb-2 border border-white/20 flex items-center justify-center shadow-md">
                      <div className="w-5 sm:w-6 h-1 bg-black/70 rounded-full" />
                    </div>

                    {/* Top Security Header with EMV Gold Chip */}
                    <div className={`flex items-center justify-between border-b pb-2.5 mb-2.5 ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center space-x-2.5">
                        {/* Realistic Gold EMV Smart Chip */}
                        <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/80 shadow flex items-center justify-center p-0.5 relative overflow-hidden">
                          <div className="w-full h-full border border-amber-900/40 rounded-sm grid grid-cols-2 grid-rows-2 gap-0.5">
                            <div className="border-r border-b border-amber-900/40" />
                            <div className="border-b border-amber-900/40" />
                            <div className="border-r border-amber-900/40" />
                            <div />
                          </div>
                        </div>
                        <div>
                          <span className={`block text-[9px] font-mono font-bold tracking-widest ${
                            isDark ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            PASS // LEVEL 05
                          </span>
                          <span className="block text-[8px] font-mono text-[#00df8f] tracking-wider">
                            HEAD OF IT CLEARANCE
                          </span>
                        </div>
                      </div>

                      {/* Flip Back Button */}
                      <button
                        onClick={toggleFlip}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                          isDark 
                            ? 'bg-[#00df8f]/15 hover:bg-[#00df8f] text-[#00df8f] hover:text-black border border-[#00df8f]/30' 
                            : 'bg-[#00b373]/10 hover:bg-[#00b373] text-[#00b373] hover:text-white border border-[#00b373]/30'
                        }`}
                        title="Balik ke depan"
                      >
                        <RotateCw size={11} className="transition-transform group-hover:-rotate-180 duration-500" />
                        <span>DEPAN</span>
                      </button>
                    </div>

                    {/* Identity & Credentials */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-base sm:text-lg font-black font-display tracking-tight flex items-center ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {profile?.name || 'Septian'}{profile?.degree ? `, ${profile.degree}` : ''}
                          <ShieldCheck size={16} className="text-[#00df8f] ml-1.5" />
                        </h4>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          UNIKOM
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#00df8f] tracking-wide mt-0.5">
                        Head of IT Support & Full Stack Developer
                      </p>
                      <p className={`text-[9px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        S1 Teknik Informatika — UNIKOM Bandung
                      </p>
                    </div>

                    {/* Enterprise Retail Capabilities (Detail Kerjaan) */}
                    <div className={`p-2.5 rounded-xl border text-left space-y-2 mb-2 ${
                      isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <Building2 size={13} className="text-[#00df8f] shrink-0 mt-0.5" />
                        <div className="text-[10px] leading-tight">
                          <span className={`font-semibold block ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                            Operasional Multi-Cabang:
                          </span>
                          <span className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                            8 Toko (Yen's Baby Shop & Borma) + 1 Head Office Terpusat.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <HardDrive size={13} className="text-[#00df8f] shrink-0 mt-0.5" />
                        <div className="text-[10px] leading-tight">
                          <span className={`font-semibold block ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                            Sistem ERP & Standarisasi:
                          </span>
                          <span className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                            Harmonisasi 1-SKU Universal, POS Kasir, Mutasi Cabang & Stock Opname.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Server size={13} className="text-[#00df8f] shrink-0 mt-0.5" />
                        <div className="text-[10px] leading-tight">
                          <span className={`font-semibold block ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                            Tech Stack & Infrastruktur:
                          </span>
                          <span className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                            Laravel, React, Flutter, SQL Server, MySQL, pfSense & Server Jaringan.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Interactive Contact Links */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`mailto:${profile?.email || 'septian.codes@gmail.com'}`}
                        className={`flex items-center space-x-1.5 p-1.5 rounded-lg border text-[9px] font-mono transition-colors ${
                          isDark 
                            ? 'bg-white/5 border-white/10 hover:border-[#00df8f] text-gray-300 hover:text-[#00df8f]' 
                            : 'bg-slate-100 border-slate-200 hover:border-[#00b373] text-slate-700 hover:text-[#00b373]'
                        }`}
                        title="Kirim Email Langsung"
                      >
                        <Mail size={11} className="text-[#00df8f]" />
                        <span className="truncate">{profile?.email || 'septian.codes@gmail.com'}</span>
                      </a>

                      <a
                        href="https://septian.info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-1.5 rounded-lg border text-[9px] font-mono transition-colors ${
                          isDark 
                            ? 'bg-white/5 border-white/10 hover:border-[#00df8f] text-gray-300 hover:text-[#00df8f]' 
                            : 'bg-slate-100 border-slate-200 hover:border-[#00b373] text-slate-700 hover:text-[#00b373]'
                        }`}
                        title="Buka Website Resmi"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <Globe size={11} className="text-[#00df8f]" />
                          <span className="truncate">septian.info</span>
                        </div>
                        <ExternalLink size={10} className="opacity-70" />
                      </a>
                    </div>

                    {/* Bottom Security Barcode & ID Stamp */}
                    <div className={`pt-2 border-t flex items-center justify-between font-mono ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      {/* Stylized Security Barcode Bars */}
                      <div className="flex items-end space-x-[2px] h-5 opacity-70">
                        <span className="w-[1.5px] h-full bg-[#00df8f]" />
                        <span className="w-[1px] h-3/4 bg-current" />
                        <span className="w-[2.5px] h-full bg-current" />
                        <span className="w-[1px] h-1/2 bg-current" />
                        <span className="w-[3px] h-full bg-[#00df8f]" />
                        <span className="w-[1px] h-3/4 bg-current" />
                        <span className="w-[1.5px] h-full bg-current" />
                        <span className="w-[2px] h-2/3 bg-current" />
                        <span className="w-[1px] h-full bg-current" />
                        <span className="w-[3px] h-full bg-[#00df8f]" />
                        <span className="w-[1.5px] h-1/2 bg-current" />
                        <span className="w-[1px] h-full bg-current" />
                        <span className="w-[2px] h-full bg-current" />
                        <span className="w-[1px] h-2/3 bg-current" />
                        <span className="w-[2.5px] h-full bg-[#00df8f]" />
                      </div>

                      <div className="text-right">
                        <span className="block text-[8px] font-mono text-[#00df8f] tracking-widest font-bold">
                          ID: STN-2017-HO-01
                        </span>
                        <span className={`block text-[7px] tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                          BANDUNG, JAWA BARAT, ID
                        </span>
                      </div>
                    </div>

                    {/* Return Hint */}
                    <div className="mt-1.5 text-center">
                      <span className={`text-[8.5px] font-mono tracking-wider flex items-center justify-center space-x-1 ${
                        isDark ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        <RotateCw size={9} className="text-[#00df8f] mr-1" />
                        <span>KLIK UNTUK KEMBALI KE DEPAN</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
