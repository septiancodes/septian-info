import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Info, Layers, Phone, Key, Save, ArrowLeft, 
  Plus, Trash2, Edit2, Upload, CheckCircle2, AlertCircle, Eye, RefreshCw, Sun, Moon, ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchPortfolioData, savePortfolioData, changeAdminPin, uploadMedia } from '../lib/portfolioService';

export default function AdminDashboard({ onBackToSite, onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Data state
  const [profile, setProfile] = useState({
    name: 'Septian',
    degree: 'S.Kom',
    photoUrl: '/foto-saya.jpg',
    email: 'hello@septian.dev',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      dribbble: 'https://dribbble.com',
    }
  });

  const [translations, setTranslations] = useState(null);

  // Modal state for project add/edit
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectIdx, setEditingProjectIdx] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    descriptionId: '',
    descriptionEn: '',
    image: '',
    tags: '',
    link: '#',
  });

  // Security / PIN state
  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [pinLoading, setPinLoading] = useState(false);

  // Fetch portfolio data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPortfolioData();
      if (data?.profile) setProfile(data.profile);
      if (data?.translations) setTranslations(data.translations);
    } catch (err) {
      console.warn('Gagal memuat data dari Supabase, menggunakan data cadangan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Save all portfolio data to Supabase
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await savePortfolioData(profile, translations);
      showToast('Semua perubahan berhasil disimpan ke database Supabase!');
    } catch (err) {
      showToast('Gagal menyimpan ke database Supabase: ' + (err.message || ''), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle Photo Upload to Supabase Storage
  const handleFileUpload = async (e, targetField = 'photoUrl') => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      showToast('Sedang mengunggah file ke cloud storage...');
      const { url } = await uploadMedia(file, targetField === 'photoUrl' ? 'profile' : 'projects');
      if (url) {
        if (targetField === 'photoUrl') {
          setProfile(prev => ({ ...prev, photoUrl: url }));
        } else if (targetField === 'projectImage') {
          setProjectForm(prev => ({ ...prev, image: url }));
        }
        showToast('File berhasil diunggah ke Supabase Storage!');
      }
    } catch (err) {
      showToast('Gagal mengunggah file: ' + (err.message || ''), 'error');
    }
  };

  // Project modal open for Add or Edit
  const openProjectModal = (idx = null) => {
    if (idx !== null && translations?.id?.works?.projects[idx]) {
      const pId = translations.id.works.projects[idx];
      const pEn = translations.en.works.projects[idx] || {};
      setEditingProjectIdx(idx);
      setProjectForm({
        title: pId.title || '',
        category: pId.category || '',
        descriptionId: pId.description || '',
        descriptionEn: pEn.description || '',
        image: pId.image || '',
        tags: Array.isArray(pId.tags) ? pId.tags.join(', ') : '',
        link: pId.link || '#',
      });
    } else {
      setEditingProjectIdx(null);
      setProjectForm({
        title: '',
        category: '',
        descriptionId: '',
        descriptionEn: '',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
        tags: 'React.js, Tailwind CSS',
        link: '#',
      });
    }
    setProjectModalOpen(true);
  };

  // Save Project from modal
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!translations) return;

    const updatedProjectsId = [...(translations.id.works.projects || [])];
    const updatedProjectsEn = [...(translations.en.works.projects || [])];

    const tagArray = projectForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    const projectDataId = {
      id: editingProjectIdx !== null ? updatedProjectsId[editingProjectIdx].id : Date.now(),
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.descriptionId,
      image: projectForm.image,
      tags: tagArray,
      link: projectForm.link,
    };

    const projectDataEn = {
      id: projectDataId.id,
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.descriptionEn || projectForm.descriptionId,
      image: projectForm.image,
      tags: tagArray,
      link: projectForm.link,
    };

    if (editingProjectIdx !== null) {
      updatedProjectsId[editingProjectIdx] = projectDataId;
      updatedProjectsEn[editingProjectIdx] = projectDataEn;
    } else {
      updatedProjectsId.push(projectDataId);
      updatedProjectsEn.push(projectDataEn);
    }

    setTranslations(prev => ({
      ...prev,
      id: { ...prev.id, works: { ...prev.id.works, projects: updatedProjectsId } },
      en: { ...prev.en, works: { ...prev.en.works, projects: updatedProjectsEn } },
    }));

    setProjectModalOpen(false);
    showToast('Proyek berhasil diperbarui dalam daftar. Klik "Simpan Semua" untuk menyimpan permanen.');
  };

  // Delete Project
  const handleDeleteProject = (idx) => {
    if (!window.confirm('Yakin ingin menghapus karya ini?')) return;
    const updatedProjectsId = translations.id.works.projects.filter((_, i) => i !== idx);
    const updatedProjectsEn = translations.en.works.projects.filter((_, i) => i !== idx);

    setTranslations(prev => ({
      ...prev,
      id: { ...prev.id, works: { ...prev.id.works, projects: updatedProjectsId } },
      en: { ...prev.en, works: { ...prev.en.works, projects: updatedProjectsEn } },
    }));
    showToast('Karya dihapus dari daftar.');
  };

  // Change PIN in Supabase
  const handleChangePin = async (e) => {
    e.preventDefault();
    if (pinForm.newPin !== pinForm.confirmPin) {
      showToast('PIN baru dan konfirmasi tidak cocok.', 'error');
      return;
    }

    setPinLoading(true);
    try {
      const result = await changeAdminPin(pinForm.currentPin, pinForm.newPin);
      if (result.success) {
        showToast('PIN Admin berhasil diperbarui di Supabase!');
        setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      } else {
        showToast(result.error || 'Gagal mengubah PIN.', 'error');
      }
    } catch (err) {
      showToast('Gagal menghubungi database Supabase.', 'error');
    } finally {
      setPinLoading(false);
    }
  };

  if (loading || !translations) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-mono ${
        isDark ? 'bg-[#0d1116] text-[#00df8f]' : 'bg-slate-50 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <RefreshCw size={24} className="animate-spin" />
          <span>MEMUAT DATABASE PORTOFOLIO...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Profil & Hero', icon: User },
    { id: 'about', label: 'Tentang & Skills', icon: Info },
    { id: 'works', label: 'Karya / Proyek', icon: Briefcase },
    { id: 'services', label: 'Tahapan Layanan', icon: Layers },
    { id: 'contact', label: 'Kontak & Medsos', icon: Phone },
    { id: 'security', label: 'Keamanan (PIN)', icon: Key },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0d1116] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-[#00df8f]/20 border-[#00df8f] text-[#00df8f]'
                : 'bg-rose-500/20 border-rose-500 text-rose-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#14181f]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToSite}
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-2 text-xs font-mono font-bold uppercase ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Lihat Portofolio</span>
            </button>
            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
            <h1 className="text-lg font-bold font-display tracking-tight flex items-center">
              <span>PORTFOLIO</span>
              <span className="text-[#00df8f] ml-1.5 px-2 py-0.5 rounded-md bg-[#00df8f]/10 text-xs font-mono">CMS</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark ? 'bg-white/5 border-white/10 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Save All Button */}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00df8f] to-[#00b373] text-black font-bold text-xs tracking-wider uppercase flex items-center space-x-2 hover:shadow-[0_0_20px_rgba(0,223,143,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'MENYIMPAN...' : 'SIMPAN SEMUA'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
              title="Keluar dari Admin"
            >
              KELUAR
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <nav className={`p-2.5 rounded-3xl border space-y-1.5 ${
              isDark ? 'bg-[#14181f]/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all text-left ${
                      isActive
                        ? 'bg-[#00df8f] text-black font-extrabold shadow-md'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9">
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#14181f]/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>

              {/* 1. HERO & PROFIL TAB */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display">Pengaturan Profil & Hero</h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Atur nama, gelar akademik, foto kartu identitas, dan teks pembuka portofolio.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        Nama Tampilan
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    {/* Gelar Akademik */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        Gelar Akademik (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: S.Kom"
                        value={profile.degree || ''}
                        onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Foto Kartu Profil / Avatar */}
                  <div className="pt-4 border-t border-white/5">
                    <label className="block text-xs font-mono uppercase tracking-wider mb-3 text-gray-400">
                      Foto Kartu ID Badge
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[#00df8f]/40 relative bg-black/40 flex-shrink-0">
                        <img
                          src={profile.photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-3 w-full">
                        <div className="flex items-center space-x-3">
                          <label className="px-4 py-2.5 rounded-xl bg-[#00df8f]/10 border border-[#00df8f]/30 text-[#00df8f] text-xs font-bold font-mono tracking-wider cursor-pointer hover:bg-[#00df8f]/20 transition-all flex items-center space-x-2">
                            <Upload size={16} />
                            <span>UNGGAH FOTO DARI KOMPUTER</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'photoUrl')}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL / path gambar..."
                          value={profile.photoUrl}
                          onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                            isDark ? 'bg-black/30 border-white/15 text-gray-300' : 'bg-slate-50 border-slate-300 text-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Headline & Intro ID/EN */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <h3 className="text-sm font-bold font-mono uppercase text-[#00df8f]">
                      // Teks Pembuka (Hero Intro)
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-gray-400">
                        Deskripsi Singkat (Bahasa Indonesia)
                      </label>
                      <textarea
                        rows={3}
                        value={translations.id.hero.intro}
                        onChange={(e) => setTranslations({
                          ...translations,
                          id: { ...translations.id, hero: { ...translations.id.hero, intro: e.target.value } }
                        })}
                        className={`w-full p-4 rounded-xl border text-sm font-sans focus:outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-gray-400">
                        Deskripsi Singkat (English)
                      </label>
                      <textarea
                        rows={3}
                        value={translations.en.hero.intro}
                        onChange={(e) => setTranslations({
                          ...translations,
                          en: { ...translations.en, hero: { ...translations.en.hero, intro: e.target.value } }
                        })}
                        className={`w-full p-4 rounded-xl border text-sm font-sans focus:outline-none ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display">Pengaturan Bagian Tentang (About)</h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Ubah biografi, filosofi kerja, serta angka pencapaian statistik.
                    </p>
                  </div>

                  {/* Bio ID */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-sm font-bold font-mono uppercase text-[#00df8f]">
                      // Biografi Bahasa Indonesia
                    </h3>
                    <div>
                      <label className="block text-xs font-mono uppercase mb-1.5 text-gray-400">Paragraf 1</label>
                      <textarea
                        rows={3}
                        value={translations.id.about.p1}
                        onChange={(e) => setTranslations({
                          ...translations,
                          id: { ...translations.id, about: { ...translations.id.about, p1: e.target.value } }
                        })}
                        className={`w-full p-3.5 rounded-xl border text-sm ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase mb-1.5 text-gray-400">Paragraf 2</label>
                      <textarea
                        rows={3}
                        value={translations.id.about.p2}
                        onChange={(e) => setTranslations({
                          ...translations,
                          id: { ...translations.id, about: { ...translations.id.about, p2: e.target.value } }
                        })}
                        className={`w-full p-3.5 rounded-xl border text-sm ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bio EN */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-sm font-bold font-mono uppercase text-[#00df8f]">
                      // English Biography
                    </h3>
                    <div>
                      <label className="block text-xs font-mono uppercase mb-1.5 text-gray-400">Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={translations.en.about.p1}
                        onChange={(e) => setTranslations({
                          ...translations,
                          en: { ...translations.en, about: { ...translations.en.about, p1: e.target.value } }
                        })}
                        className={`w-full p-3.5 rounded-xl border text-sm ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase mb-1.5 text-gray-400">Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={translations.en.about.p2}
                        onChange={(e) => setTranslations({
                          ...translations,
                          en: { ...translations.en, about: { ...translations.en.about, p2: e.target.value } }
                        })}
                        className={`w-full p-3.5 rounded-xl border text-sm ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. WORKS / PROJECTS TAB */}
              {activeTab === 'works' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-display">Kelola Karya & Proyek</h2>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        Tambah, ubah, atau hapus daftar proyek portfolio yang ditampilkan.
                      </p>
                    </div>
                    <button
                      onClick={() => openProjectModal(null)}
                      className="px-4 py-2.5 rounded-xl bg-[#00df8f] text-black font-bold text-xs tracking-wider uppercase flex items-center space-x-2 hover:bg-[#00b373] transition-all self-start"
                    >
                      <Plus size={16} />
                      <span>TAMBAH KARYA BARU</span>
                    </button>
                  </div>

                  {/* Project Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    {translations.id.works.projects.map((project, idx) => (
                      <div
                        key={project.id || idx}
                        className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 ${
                          isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex space-x-4">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-mono text-[#00df8f] uppercase font-bold">
                              {project.category}
                            </span>
                            <h4 className="text-sm font-bold truncate mt-0.5">
                              {project.title}
                            </h4>
                            <p className={`text-xs line-clamp-2 mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex flex-wrap gap-1">
                            {project.tags?.slice(0, 2).map((t, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openProjectModal(idx)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-[#00df8f]/20 hover:text-[#00df8f] transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(idx)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display">Tahapan Layanan (Workflow)</h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Sesuaikan 6 tahapan alur kerja dan hasil deliverable.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {translations.id.services.stages.map((stage, idx) => (
                      <div
                        key={stage.number}
                        className={`p-5 rounded-2xl border ${
                          isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xs font-mono font-bold text-[#00df8f] px-2 py-1 rounded bg-[#00df8f]/10">
                            TAHAP {stage.number}
                          </span>
                          <input
                            type="text"
                            value={stage.title}
                            onChange={(e) => {
                              const newStages = [...translations.id.services.stages];
                              newStages[idx].title = e.target.value;
                              setTranslations({
                                ...translations,
                                id: { ...translations.id, services: { ...translations.id.services, stages: newStages } }
                              });
                            }}
                            className={`w-full px-3 py-1.5 rounded-lg border text-sm font-bold ${
                              isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={stage.description}
                          onChange={(e) => {
                            const newStages = [...translations.id.services.stages];
                            newStages[idx].description = e.target.value;
                            setTranslations({
                              ...translations,
                              id: { ...translations.id, services: { ...translations.id.services, stages: newStages } }
                            });
                          }}
                          className={`w-full p-3 rounded-lg border text-xs ${
                            isDark ? 'bg-black/40 border-white/15 text-gray-300' : 'bg-white border-slate-300 text-slate-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. CONTACT & SOCIALS TAB */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display">Pengaturan Kontak & Media Sosial</h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Atur alamat email dan tautan akun sosial media Anda.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        Email Kontak
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={profile.socials?.github || ''}
                          onChange={(e) => setProfile({
                            ...profile,
                            socials: { ...profile.socials, github: e.target.value }
                          })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${
                            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={profile.socials?.linkedin || ''}
                          onChange={(e) => setProfile({
                            ...profile,
                            socials: { ...profile.socials, linkedin: e.target.value }
                          })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${
                            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                          Twitter / X URL
                        </label>
                        <input
                          type="url"
                          value={profile.socials?.twitter || ''}
                          onChange={(e) => setProfile({
                            ...profile,
                            socials: { ...profile.socials, twitter: e.target.value }
                          })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${
                            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                          Lynk.id (Katalog Digital / Source Code)
                        </label>
                        <input
                          type="url"
                          placeholder="https://lynk.id/..."
                          value={profile.socials?.lynkid || ''}
                          onChange={(e) => setProfile({
                            ...profile,
                            socials: { ...profile.socials, lynkid: e.target.value }
                          })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${
                            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                          File / URL CV (PDF)
                        </label>
                        <input
                          type="text"
                          placeholder="/CV_Septian.pdf"
                          value={profile.cvUrl || ''}
                          onChange={(e) => setProfile({
                            ...profile,
                            cvUrl: e.target.value
                          })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${
                            isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SECURITY / CHANGE PIN TAB */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md">
                  <div>
                    <h2 className="text-xl font-bold font-display">Ganti PIN Keamanan</h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Ubah PIN yang digunakan untuk masuk ke dashboard admin ini.
                    </p>
                  </div>

                  <form onSubmit={handleChangePin} className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        PIN Saat Ini
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="PIN lama (Default: 123456)"
                        value={pinForm.currentPin}
                        onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-widest ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        PIN Baru
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="PIN Baru"
                        value={pinForm.newPin}
                        onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-widest ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-2 text-gray-400">
                        Konfirmasi PIN Baru
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Ulangi PIN Baru"
                        value={pinForm.confirmPin}
                        onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-widest ${
                          isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={pinLoading}
                      className="w-full py-3.5 rounded-xl bg-[#00df8f] text-black font-bold text-xs font-mono tracking-wider uppercase hover:bg-[#00b373] transition-all cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {pinLoading ? 'MENYIMPAN...' : 'PERBARUI PIN'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Project Add / Edit Modal */}
      <AnimatePresence>
        {projectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-xl p-6 sm:p-8 rounded-3xl border shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
                isDark ? 'bg-[#14181f] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h3 className="text-xl font-bold font-display mb-4">
                {editingProjectIdx !== null ? 'Edit Karya / Proyek' : 'Tambah Karya Baru'}
              </h3>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Judul Proyek</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Kategori / Bidang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BRANDING & WEB DESIGN"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Image Cover */}
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Gambar Cover / Thumbnail</label>
                  <div className="flex items-center space-x-3 mb-2">
                    <label className="px-3 py-2 rounded-xl bg-[#00df8f]/10 border border-[#00df8f]/30 text-[#00df8f] text-xs font-bold font-mono tracking-wider cursor-pointer hover:bg-[#00df8f]/20 flex items-center space-x-2">
                      <Upload size={14} />
                      <span>UNGGAH GAMBAR</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'projectImage')}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Atau URL gambar..."
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono ${
                      isDark ? 'bg-black/40 border-white/15 text-gray-300' : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Deskripsi (Bahasa Indonesia)</label>
                  <textarea
                    rows={3}
                    required
                    value={projectForm.descriptionId}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionId: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Description (English)</label>
                  <textarea
                    rows={3}
                    value={projectForm.descriptionEn}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-sm ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">Tags Teknologi (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    placeholder="React.js, Next.js, Three.js"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white/5"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00df8f] text-black font-bold text-xs uppercase hover:bg-[#00b373]"
                  >
                    SIMPAN KARYA
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
