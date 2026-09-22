import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function RecentWorks() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  const projects = t.works.projects;

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const activeProject = projects[activeIdx] || projects[0];

  return (
    <section id="work" className={`py-32 relative border-t overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] border-white/5' : 'bg-[#f8fafc] border-slate-200'
    }`}>
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-[#00df8f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Top Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6 border-b pb-8 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#00df8f] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00df8f]" />
              <span>{t.works.label}</span>
            </div>
            <h2 className={`text-4xl sm:text-6xl font-extrabold tracking-tighter font-display leading-[0.9] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t.works.title}<span className="text-[#00df8f]">.</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {}}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full border text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${
                isDark 
                  ? 'bg-[#14181f] border-white/10 text-white hover:border-[#00df8f]/50 hover:text-[#00df8f]' 
                  : 'bg-white border-slate-200 text-slate-800 hover:border-[#00b373] hover:text-[#00b373] shadow-sm'
              }`}
            >
              <span>{t.works.viewAll}</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Core Mechanic: 3D Stacked Card Interactive Deck (12 Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: The 3D Card Stack (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Stack Container */}
            <div className="relative w-full h-[340px] sm:h-[450px] md:h-[480px] perspective-1000 flex justify-center">
              {projects.map((project, idx) => {
                const total = projects.length;
                const diff = (idx - activeIdx + total) % total;
                const isActive = diff === 0;

                return (
                  <motion.div
                    key={project.id}
                    onClick={() => setActiveIdx(idx)}
                    initial={false}
                    animate={{
                      y: diff * 32,
                      scale: 1 - diff * 0.05,
                      rotateX: diff * 3,
                      zIndex: total - diff,
                      opacity: diff > 3 ? 0 : 1 - diff * 0.15,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    whileHover={isActive ? { scale: 1.02 } : { scale: 1 - diff * 0.05 + 0.02 }}
                    className={`absolute inset-x-0 mx-auto max-w-xl w-full h-[300px] sm:h-[380px] md:h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border transition-colors duration-300 ${
                      isActive
                        ? isDark
                          ? 'border-[#00df8f]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
                          : 'border-[#00b373] shadow-[0_20px_40px_rgba(0,0,0,0.15)]'
                        : isDark
                          ? 'border-white/10 bg-[#14181f]'
                          : 'border-slate-200 bg-white shadow-md'
                    }`}
                    style={{
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* Background Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1116] via-[#0d1116]/40 to-transparent" />

                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#0d1116]/80 backdrop-blur-md border border-[#00df8f]/50 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#00df8f] animate-ping" />
                        <span className="text-[10px] font-bold tracking-widest text-[#00df8f] uppercase">
                          {t.works.activeBadge} 0{project.id}
                        </span>
                      </div>
                    )}

                    {/* Overlay Card Label */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[10px] font-mono text-[#00df8f] tracking-widest uppercase">
                          {project.category}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black tracking-tight font-display">
                          {project.title}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <ArrowUpRight size={20} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Navigation Controls */}
            <div className="flex items-center justify-between w-full max-w-xl mt-6 px-2">
              {/* Arrow Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className={`p-3 rounded-full border transition-all ${
                    isDark 
                      ? 'bg-[#14181f] border-white/10 text-gray-300 hover:text-white hover:border-[#00df8f]' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#00b373] shadow-sm'
                  }`}
                  aria-label="Previous project"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className={`p-3 rounded-full border transition-all ${
                    isDark 
                      ? 'bg-[#14181f] border-white/10 text-gray-300 hover:text-white hover:border-[#00df8f]' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#00b373] shadow-sm'
                  }`}
                  aria-label="Next project"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Navigation Dot Indicators */}
              <div className="flex items-center space-x-2">
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === activeIdx
                        ? 'w-8 bg-[#00df8f] shadow-[0_0_10px_rgba(0,223,143,0.8)]'
                        : isDark
                          ? 'w-2.5 bg-white/20 hover:bg-white/40'
                          : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                0{activeIdx + 1} / 0{projects.length}
              </span>
            </div>
          </div>

          {/* Right Side: Dynamic Description Panel (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start pt-4 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-start space-y-6"
              >
                {/* Category Tag */}
                <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border ${
                  isDark ? 'bg-[#14181f] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-[#00df8f]" />
                  <span className="text-xs font-bold tracking-widest text-[#00df8f] uppercase">
                    {activeProject.category}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[0.95] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeProject.title}
                </h3>

                {/* Project Description */}
                <p className={`text-base sm:text-lg leading-relaxed font-sans ${
                  isDark ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {activeProject.description}
                </p>

                {/* Impact Metric Callout */}
                {activeProject.impact && (
                  <div className={`p-4 rounded-2xl border flex items-start space-x-3 w-full ${
                    isDark ? 'bg-[#00df8f]/5 border-[#00df8f]/20 text-[#00df8f]' : 'bg-[#00df8f]/10 border-[#00df8f]/30 text-[#008f5d]'
                  }`}>
                    <TrendingUp size={18} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-mono uppercase font-bold tracking-wider">BUSINESS IMPACT</span>
                      <p className="text-xs font-semibold mt-0.5">{activeProject.impact}</p>
                    </div>
                  </div>
                )}

                {/* Tags Array of Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3.5 py-1.5 rounded-full border font-mono text-xs tracking-wider ${
                        isDark 
                          ? 'bg-white/5 border-white/10 text-gray-300' 
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Explore Project Button */}
                <div className="pt-4">
                  <a
                    href={activeProject.link || '#'}
                    className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#00df8f] text-black font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#00b373] hover:shadow-[0_0_25px_rgba(0,223,143,0.4)] cursor-pointer"
                  >
                    <span>{t.works.viewProject}</span>
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
