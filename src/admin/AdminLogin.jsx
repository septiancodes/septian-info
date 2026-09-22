import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const { isDark } = useTheme();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin) {
      setError('Silakan masukkan PIN admin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('admin_token', data.token);
        onLoginSuccess();
      } else {
        setError(data.error || 'PIN tidak valid.');
      }
    } catch (err) {
      // Fallback offline mock check if API server isn't running
      if (pin === '123456') {
        sessionStorage.setItem('admin_token', 'offline-session');
        onLoginSuccess();
      } else {
        setError('Gagal menghubungi server API. Gunakan PIN default 123456.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-[#00df8f]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`relative w-full max-w-md p-8 rounded-3xl border backdrop-blur-xl shadow-2xl ${
          isDark 
            ? 'bg-[#14181f]/90 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]' 
            : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        {/* Back button */}
        <button
          onClick={onBackToSite}
          className={`inline-flex items-center space-x-2 text-xs font-mono tracking-wider mb-8 transition-colors ${
            isDark ? 'text-gray-400 hover:text-[#00df8f]' : 'text-slate-500 hover:text-[#00b373]'
          }`}
        >
          <ArrowLeft size={16} />
          <span>KEMBALI KE PORTOFOLIO</span>
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 border ${
            isDark 
              ? 'bg-[#00df8f]/10 border-[#00df8f]/30 text-[#00df8f]' 
              : 'bg-[#00df8f]/15 border-[#00df8f]/40 text-[#00b373]'
          }`}>
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight">
            Admin CMS Dashboard
          </h2>
          <p className={`text-xs mt-1 font-sans ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Masukkan PIN keamanan untuk mengelola isi portofolio
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2.5"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-xs font-mono tracking-widest uppercase mb-2 ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}>
              PIN ADMIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                placeholder="Masukkan PIN (Default: 123456)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className={`w-full px-4 py-3.5 pl-11 rounded-2xl border text-sm font-mono tracking-widest focus:outline-none transition-all ${
                  isDark 
                    ? 'bg-black/40 border-white/15 text-white focus:border-[#00df8f] focus:ring-2 focus:ring-[#00df8f]/20' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#00b373] focus:ring-2 focus:ring-[#00b373]/20'
                }`}
              />
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className={`text-[11px] font-mono mt-2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              * PIN default bawaan adalah: <span className="text-[#00df8f] font-bold">123456</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00df8f] to-[#00b373] text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 hover:opacity-95 hover:shadow-[0_0_25px_rgba(0,223,143,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'MEMVERIFIKASI...' : 'MASUK KE DASHBOARD'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
