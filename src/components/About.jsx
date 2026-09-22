import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Code, Layout, Palette, Cpu, Terminal, Compass, Layers, Database, Server, CheckCircle2, GraduationCap, Smartphone, Wifi, Wrench, ShieldCheck, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const skills = [
    { name: 'PHP & Laravel Backend', icon: Server, highlight: true },
    { name: 'Flutter & Dart (Mobile APK)', icon: Smartphone, highlight: true },
    { name: 'React.js & Capacitor Mobile', icon: Code, highlight: true },
    { name: 'SQL Server & MySQL (Centralized)', icon: Database, highlight: true },
    { name: 'Master SKU & Stock Opname', icon: HardDrive, highlight: true },
    { name: 'Jaringan (Router, WiFi, pfSense)', icon: Wifi },
    { name: 'Hardware, CCTV & Printer Kasir', icon: Wrench },
    { name: 'Node.js & Express', icon: Terminal },
    { name: 'Tailwind CSS & UI Systems', icon: Layers },
    { name: 'Git, Linux VPS & Deployment', icon: Zap },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="about" className={`py-32 relative border-t overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] border-white/5' : 'bg-[#f8fafc] border-slate-200'
    }`}>
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00df8f]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left Column: Purpose & Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Label */}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#00df8f] uppercase mb-4">
              <GraduationCap size={16} />
              <span>{t.about.label}</span>
            </div>

            {/* Heading */}
            <h2 className={`text-4xl sm:text-6xl font-extrabold tracking-tighter font-display leading-[0.95] mb-8 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t.about.title1} <br />
              <span className={`text-transparent bg-clip-text ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-gray-200 to-[#00df8f]' 
                  : 'bg-gradient-to-r from-slate-900 via-slate-700 to-[#00b373]'
              }`}>
                {t.about.title2}
              </span>
            </h2>

            {/* Text Paragraphs */}
            <div className={`space-y-5 leading-relaxed font-sans text-base sm:text-lg mb-10 ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Stats Grid (All 4 metrics) */}
            <div className={`pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-6 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              {t.about.stats?.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <h4 className={`text-2xl sm:text-3xl font-extrabold font-display text-[#00df8f]`}>
                    {stat.value}
                  </h4>
                  <p className={`text-xs font-semibold tracking-wider uppercase mt-1 ${
                    isDark ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Toolkit Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className={`rounded-3xl border p-8 sm:p-10 backdrop-blur-md relative overflow-hidden transition-colors duration-300 ${
              isDark 
                ? 'bg-[#14181f]/80 border-white/10 shadow-2xl' 
                : 'bg-white/90 border-slate-200 shadow-xl'
            }`}
          >
            {/* Ambient Inner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00df8f]/10 rounded-full blur-3xl pointer-events-none" />

            <div className={`flex items-center justify-between mb-8 pb-4 border-b ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <h3 className={`text-xl font-bold tracking-tight font-display flex items-center ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00df8f] mr-3" />
                {t.about.skillsLabel}
              </h3>
              <span className={`text-xs font-mono uppercase tracking-widest ${
                isDark ? 'text-[#00df8f]' : 'text-[#00b373]'
              }`}>
                LARAVEL • REACT • SQL
              </span>
            </div>

            {/* Skill Chips */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {skills.map((skill) => {
                const IconComponent = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    variants={itemVariants}
                    className={`group relative flex items-center space-x-2.5 px-4 py-3 rounded-2xl border font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:border-[#00df8f] hover:text-[#00df8f] hover:shadow-[0_0_20px_rgba(0,223,143,0.3)] hover:-translate-y-1 cursor-default ${
                      skill.highlight
                        ? isDark 
                          ? 'bg-[#00df8f]/10 border-[#00df8f]/40 text-[#00df8f]' 
                          : 'bg-[#00df8f]/10 border-[#00df8f]/50 text-[#00b373]'
                        : isDark 
                          ? 'bg-white/5 border-white/10 text-gray-300' 
                          : 'bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <IconComponent size={16} className={`transition-colors ${
                      skill.highlight ? 'text-[#00df8f]' : isDark ? 'text-gray-400 group-hover:text-[#00df8f]' : 'text-slate-500 group-hover:text-[#00b373]'
                    }`} />
                    <span>{skill.name}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Bottom Info Banner */}
            <div className={`mt-10 pt-6 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span>RETAIL B2B & ENTERPRISE ARCHITECTURE</span>
              <span className="text-[#00df8f] font-semibold">UNIKOM INFORMATICS</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

