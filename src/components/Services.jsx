import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const stages = t.services.stages;

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className={`py-32 relative border-t overflow-hidden scroll-mt-10 transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] border-white/5' : 'bg-[#f8fafc] border-slate-200'
    }`}>
      {/* Background Accent Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#00df8f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#00df8f] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00df8f]" />
            <span>{t.services.label}</span>
          </div>

          <h2 className={`text-4xl sm:text-6xl font-extrabold tracking-tighter font-display leading-[0.95] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t.services.title1} <br />
            <span 
              className="text-transparent"
              style={{ WebkitTextStroke: isDark ? '2px #00df8f' : '2px #00b373' }}
            >
              {t.services.title2}
            </span>
            <span className="text-[#00df8f]">.</span>
          </h2>
        </motion.div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-3xl transition-all duration-300 overflow-hidden border ${
                  isOpen 
                    ? isDark 
                      ? 'bg-[#14181f] border-[#00df8f]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                      : 'bg-white border-[#00b373] shadow-md'
                    : isDark 
                      ? 'bg-[#14181f]/40 border-white/10 hover:border-white/20' 
                      : 'bg-white/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Toggle Row */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-6">
                    <span className={`text-sm sm:text-base font-mono font-bold transition-colors ${
                      isOpen ? 'text-[#00df8f]' : isDark ? 'text-gray-500' : 'text-slate-400'
                    }`}>
                      {stage.number}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight font-display ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stage.title}
                    </h3>
                  </div>

                  <div className={`p-2.5 rounded-full transition-all duration-300 ${
                    isOpen 
                      ? 'bg-[#00df8f] text-black' 
                      : isDark 
                        ? 'bg-white/5 text-gray-400 border border-white/10' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={`px-6 sm:px-8 pb-8 pt-2 border-t ${
                        isDark ? 'border-white/5' : 'border-slate-100'
                      }`}>
                        <p className={`text-base sm:text-lg leading-relaxed font-sans mb-6 ${
                          isDark ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {stage.description}
                        </p>

                        {/* Deliverables Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          {stage.deliverables.map((item) => (
                            <div key={item} className={`flex items-center space-x-2 text-xs font-semibold ${
                              isDark ? 'text-gray-300' : 'text-slate-700'
                            }`}>
                              <CheckCircle2 size={14} className="text-[#00df8f] flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
