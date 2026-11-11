import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Github, Twitter, Linkedin, Dribbble, ShoppingBag, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { isDark } = useTheme();
  const { t, profile, lang } = useLanguage();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuLinks = [
    { label: t?.nav?.home || (lang === 'id' ? 'BERANDA' : 'HOME'), id: 'home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: t?.nav?.about || (lang === 'id' ? 'TENTANG' : 'ABOUT'), id: 'about' },
    { label: t?.nav?.work || (lang === 'id' ? 'KARYA' : 'WORK'), id: 'work' },
    { label: t?.nav?.services || (lang === 'id' ? 'LAYANAN' : 'SERVICES'), id: 'services' },
    { label: t?.nav?.contact || (lang === 'id' ? 'KONTAK' : 'CONTACT'), id: 'contact' },
  ];

  const socialLinks = [
    { label: 'LYNK.ID (SOURCE CODE)', url: profile?.socials?.lynkid || 'https://lynk.id', icon: ShoppingBag, highlight: true },
    { label: 'GITHUB', url: profile?.socials?.github || 'https://github.com', icon: Github },
    { label: 'LINKEDIN', url: profile?.socials?.linkedin || 'https://linkedin.com', icon: Linkedin },
    { label: 'TWITTER / X', url: profile?.socials?.twitter || 'https://twitter.com', icon: Twitter },
  ];

  return (
    <footer id="contact" className={`relative pt-32 pb-10 border-t overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] border-white/10' : 'bg-[#f8fafc] border-slate-200'
    }`}>
      {/* Background Graphic: Massive Text CONTACT */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center pointer-events-none select-none overflow-hidden leading-none">
        <h1 className={`text-[25vw] font-black tracking-tighter leading-none uppercase font-display ${
          isDark ? 'text-white opacity-[0.03]' : 'text-slate-900 opacity-[0.04]'
        }`}>
          CONTACT
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Top Row: CTA & Navigation Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          
          {/* Left Column (7 cols): CTA & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#00df8f] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00df8f]" />
              <span>{t.footer.label}</span>
            </div>

            <h2 className={`text-4xl sm:text-6xl font-extrabold tracking-tighter font-display leading-[0.95] mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t.footer.title}<span className="text-[#00df8f]">?</span>
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed max-w-lg mb-10 font-sans ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}>
              {t.footer.description}
            </p>

            {/* Email CTA Button */}
            <a
              href={`mailto:${profile?.email || 'hello@septian.dev'}`}
              className={`group inline-flex items-center space-x-4 px-8 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,223,143,0.5)] cursor-pointer ${
                isDark 
                  ? 'bg-white text-black hover:bg-[#00df8f]' 
                  : 'bg-slate-900 text-white hover:bg-[#00b373]'
              }`}
            >
              <Mail size={20} className={isDark ? 'text-black' : 'text-white'} />
              <span>{profile?.email || 'hello@septian.dev'}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white'
              }`}>
                <ArrowUpRight size={18} />
              </div>
            </a>
          </motion.div>

          {/* Right Column (5 cols): Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-2 gap-8"
          >
            {/* Menu Links */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6 font-mono">
                {t.footer.navTitle}
              </h4>
              <ul className="space-y-4">
                {menuLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => {
                        if (link.action) link.action();
                        else scrollToSection(link.id);
                      }}
                      className={`text-sm font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                        isDark ? 'text-gray-300 hover:text-[#00df8f]' : 'text-slate-700 hover:text-[#00b373]'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6 font-mono">
                {t.footer.socialsTitle}
              </h4>
              <ul className="space-y-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.label}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center space-x-2 text-sm font-semibold tracking-wider uppercase transition-colors ${
                          social.highlight
                            ? 'text-[#00df8f] hover:underline font-bold'
                            : isDark ? 'text-gray-300 hover:text-[#00df8f]' : 'text-slate-700 hover:text-[#00b373]'
                        }`}
                      >
                        <Icon size={16} className={`transition-colors ${
                          social.highlight ? 'text-[#00df8f]' : isDark ? 'text-gray-400 group-hover:text-[#00df8f]' : 'text-slate-500 group-hover:text-[#00b373]'
                        }`} />
                        <span>{social.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className={`pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isDark ? 'text-gray-500' : 'text-slate-500'
        }`}>
          <p>{t.footer.copyright}</p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-slate-800'}`}>{t.footer.privacy}</a>
            <span>•</span>
            <a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-slate-800'}`}>{t.footer.terms}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
