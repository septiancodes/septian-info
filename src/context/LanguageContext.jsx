import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPortfolioData } from '../lib/portfolioService';

const LanguageContext = createContext();

export const defaultProfile = {
  name: 'Septian',
  degree: 'S.Kom',
  role: 'Head of IT Support & Full Stack Developer',
  education: 'S1 Teknik Informatika - UNIKOM Bandung',
  photoUrl: '/foto-saya.jpg',
  email: 'septian.codes@gmail.com',
  cvUrl: '/CV_Septian.pdf',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    lynkid: 'https://lynk.id',
    twitter: 'https://twitter.com',
    ruangsistem: 'https://ruangsistem.my.id',
  },
};

export const defaultTranslations = {
  id: {
    nav: {
      home: 'BERANDA',
      about: 'TENTANG',
      work: 'KARYA',
      services: 'LAYANAN',
      contact: 'KONTAK',
      getInTouch: 'HUBUNGI SAYA',
      available: 'Tersedia untuk proyek & konsultasi',
    },
    hero: {
      badge: 'HEAD OF IT SUPPORT & FULL STACK DEVELOPER',
      headingTitle1: 'RETAIL & TECH',
      headingTitle2: 'SOLUTIONS',
      intro: "Lulusan S1 Teknik Informatika UNIKOM Bandung dengan rekam jejak sejak 2017 mengelola operasional teknologi 8 cabang retail (Yen's Baby Shop & Borma Fashion) + 1 Head Office, memimpin standarisasi sistem terpusat, dan membangun aplikasi enterprise Laravel, React, & Flutter.",
      ctaWork: 'Lihat Karya & Solusi',
      ctaContact: 'Hubungi Saya',
      ctaCv: 'Unduh CV (PDF)',
      idBadge: 'ID BADGE',
      verified: 'TERVERIFIKASI // UNIKOM',
      roleLabel: 'PERAN',
      roleValue: 'Head of IT',
      expLabel: 'PENGALAMAN',
      expValue: '2017 - Sekarang',
      statusLabel: 'STATUS',
      statusValue: 'Tersedia',
      dragHint: '[ TARIK & LEPASKAN UNTUK KEMBALI ]',
    },
    about: {
      label: 'TENTANG SEPTIAN, S.KOM.',
      title1: 'DARI LAPANGAN HINGGA',
      title2: 'ARSITEKTUR TERPUSAT.',
      p1: "Memulai karir sejak Oktober 2017 sebagai IT Support lapangan tunggal hingga dipercaya memimpin sebagai Head of IT Support untuk 8 cabang retail aktif (5 cabang Yen's Baby Shop & 3 cabang Borma Fashion) serta 1 Head Office.",
      p2: 'Berpengalaman memimpin transformasi sistem retail dari lokal menjadi terpusat di Head Office, standarisasi 1 Barang = 1 SKU Universal, manajemen stock opname lapangan, pemeliharaan hardware/jaringan/CCTV, serta perancangan aplikasi full stack modern dengan Laravel, React, Flutter, dan database SQL Server/MySQL.',
      stats: [
        { value: '2017+', label: 'Dedikasi Sejak' },
        { value: '8 Toko + 1 HO', label: 'Skala Pengelolaan' },
        { value: '1 SKU', label: 'Standarisasi Terpusat' },
        { value: 'UNIKOM', label: 'S1 Teknik Informatika' },
      ],
      skillsLabel: 'KEAHLIAN LENGKAP: SOFTWARE, DATABASE & HARDWARE',
      skillsTitle: 'TECH STACK, INFRASTRUKTUR & DATABASE',
    },
    works: {
      label: 'STUDI KASUS PROYEK NYATA',
      title: 'KARYA & SISTEM TERBAIK',
      viewAll: 'Semua Proyek',
      activeBadge: 'PROYEK RETAIL',
      viewProject: 'Lihat Studi Kasus',
      stackLabel: 'TEKNOLOGI',
      prev: 'Sebelumnya',
      next: 'Berikutnya',
      projects: [
        {
          id: 1,
          title: 'RETAIL ATTENDANCE & HR SYSTEM v2.0',
          category: 'MOBILE APP (FLUTTER / CAPACITOR) & BACKOFFICE',
          description: 'Aplikasi presensi terpadu multi-cabang dengan validasi geolocation real-time, foto selfie anti-mock location, dan backoffice approval cuti/lembur berbasis Laravel.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
          tags: ['Flutter', 'Capacitor Mobile', 'React.js', 'Laravel', 'MySQL', 'Tailwind CSS'],
          link: '#',
          impact: 'Digunakan staf di seluruh cabang dengan akurasi presensi real-time 100%',
        },
        {
          id: 2,
          title: 'CENTRALIZED RETAIL BACKOFFICE & MASTER SKU ENGINE',
          category: 'ENTERPRISE RETAIL ERP',
          description: 'Transformasi sistem dari database lokal menjadi terpusat di Head Office, standarisasi 1 Barang = 1 SKU Universal, manajemen SPK mutasi antar-cabang, dan alur stock opname terstruktur.',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
          tags: ['Laravel', 'PHP', 'SQL Server', 'Stored Procedure', 'REST API'],
          link: '#',
          impact: 'Menghilangkan selisih kode barang dan menyatukan sinkronisasi data 8 cabang retail',
        },
        {
          id: 3,
          title: 'MULTI-TENANT LAUNDRY SAAS PLATFORM',
          category: 'CLOUD SAAS ARCHITECTURE',
          description: 'Arsitektur platform SaaS multi-tenant otomatis: customer daftar ➔ sistem otomatis membuat subdomain toko ➔ login POS & Dashboard khusus tenant ➔ Superadmin monitoring.',
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
          tags: ['Node.js', 'Express', 'React.js', 'Subdomain Engine', 'MySQL'],
          link: '#',
          impact: 'Otomatisasi pembuatan toko digital instan dan manajemen multi-cabang bisnis',
        },
        {
          id: 4,
          title: 'ESTEHATAN POS & SMART WHATSAPP LOYALTY',
          category: 'POS & UMKM DIGITALIZATION',
          description: 'Sistem Web POS kasir terintegrasi Customer View, registrasi loyalty member instan via nomor WhatsApp, dan cetak struk via Bluetooth Thermal Printer.',
          image: 'https://images.unsplash.com/photo-1556742049-0a67e557b683?q=80&w=800&auto=format&fit=crop',
          tags: ['React.js', 'Web POS', 'Bluetooth Thermal', 'WhatsApp Engine', 'Tailwind'],
          link: '#',
          impact: 'Mempercepat waktu checkout kasir dan meningkatkan retensi pelanggan melalui poin member',
        },
      ],
    },
    services: {
      label: 'ALUR IMPLEMENTASI & PENGEMBANGAN',
      title1: 'TAHAPAN PENGEMBANGAN',
      title2: 'SOFTWARE & SISTEM RETAIL',
      stages: [
        {
          number: '01',
          title: 'ANALISIS PROSES BISNIS & AUDIT OPERASIONAL',
          description: 'Audit alur kerja lantai toko (kasir, gudang, purchasing), pemetaan kendala di lapangan, identifikasi integrasi cabang, serta perumusan SLA.',
          deliverables: ['Business Flow Diagram', 'System Scope Document', 'Spesifikasi Fitur', 'Timeline Implementasi'],
        },
        {
          number: '02',
          title: 'DESAIN SKEMA DATABASE & STANDARISASI SKU',
          description: 'Merancang ERD relational database (SQL Server / MySQL), standarisasi 1 SKU universal, stored procedures untuk transaksi tinggi, dan kontrak REST API.',
          deliverables: ['Database ERD Schema', 'Standarisasi SKU & Supplier', 'API Contract Spec', 'Security Role Matrix'],
        },
        {
          number: '03',
          title: 'PROTOTYPING & UI/UX WORKFLOW TOKO',
          description: 'Mendesain antarmuka mobile APK (Flutter/React) & dashboard backoffice yang ergonomis, cepat diakses oleh kasir/staf toko, dan minim klik.',
          deliverables: ['Wireframe Mobile & Web', 'Desain Dashboard Backoffice', 'Interactive Flow', 'Design System UI'],
        },
        {
          number: '04',
          title: 'PENGEMBANGAN FULL STACK & MOBILE (FLUTTER/LARAVEL)',
          description: 'Pembangunan backend scalable dengan Laravel / Node.js serta aplikasi mobile Flutter / Capacitor APK dengan arsitektur bersih dan terstruktur.',
          deliverables: ['Source Code Laravel & Flutter', 'Mobile APK Build', 'Database Stored Procedures', 'Integrasi Middleware'],
        },
        {
          number: '05',
          title: 'UAT, STOCK OPNAME & INTEGRASI CABANG',
          description: 'Uji fungsionalitas menyeluruh (User Acceptance Test), simulasi stock opname lapangan, validasi geolocation presensi, dan uji beban server.',
          deliverables: ['UAT Sign-Off', 'SOP Stock Opname', 'Bug Fixing Log', 'Multi-Branch Pilot Test'],
        },
        {
          number: '06',
          title: 'DEPLOYMENT PRODUKSI, CCTV/JARINGAN & ONBOARDING',
          description: 'Deployment live server (VPS / On-Premise), setup auto-backup database harian, integrasi jaringan/CCTV toko, SOP operasional, serta pelatihan staf.',
          deliverables: ['Live Production Deploy', 'Automated DB Backup', 'User Manual / SOP', 'Support Maintenance'],
        },
      ],
    },
    footer: {
      label: 'MARI BERKOLABORASI',
      title: 'SIAP MEMBANGUN & MENGOPTIMALKAN SISTEM ANDA',
      description: 'Butuh pengembangan software retail terpadu, aplikasi mobile Flutter, standarisasi database terpusat, atau konsultasi infrastruktur IT? Hubungi saya.',
      navTitle: '// NAVIGASI',
      socialsTitle: '// TAUTAN & PLATFORM DIGITAL',
      copyright: '© 2026 Septian, S.Kom. Hak cipta dilindungi.',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Layanan',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      work: 'WORK',
      services: 'SERVICES',
      contact: 'CONTACT',
      getInTouch: 'GET IN TOUCH',
      available: 'Available for projects & consulting',
    },
    hero: {
      badge: 'HEAD OF IT SUPPORT & FULL STACK DEVELOPER',
      headingTitle1: 'RETAIL & TECH',
      headingTitle2: 'SOLUTIONS',
      intro: "Informatics Engineering graduate from UNIKOM Bandung with a proven track record since 2017 managing IT operations across 8 retail branches (Yen's Baby Shop & Borma Fashion) + 1 Head Office, leading centralized system harmonization, and developing enterprise software with Laravel, React, & Flutter.",
      ctaWork: 'View Works & Solutions',
      ctaContact: 'Get in Touch',
      ctaCv: 'Download CV (PDF)',
      idBadge: 'ID BADGE',
      verified: 'VERIFIED // UNIKOM',
      roleLabel: 'ROLE',
      roleValue: 'Head of IT',
      expLabel: 'EXPERIENCE',
      expValue: '2017 - Present',
      statusLabel: 'STATUS',
      statusValue: 'Available',
      dragHint: '[ PULL & RELEASE TO SNAP BACK ]',
    },
    about: {
      label: 'ABOUT SEPTIAN, S.KOM.',
      title1: 'FROM ON-FIELD SUPPORT TO',
      title2: 'CENTRALIZED ARCHITECTURE.',
      p1: "Began my professional career in October 2017 as a solo on-field IT Support specialist, progressively advancing to lead technological operations as Head of IT Support across 8 active retail stores (5 Yen's Baby Shop & 3 Borma Fashion branches) and 1 Head Office.",
      p2: 'Proven track record in spearheading retail database centralization to Head Office, standardizing 1 Item = 1 Universal SKU, field stock opname management, network/hardware/CCTV infrastructure maintenance, and full-stack software development with Laravel, React, Flutter, and SQL Server/MySQL.',
      stats: [
        { value: '2017+', label: 'Dedicated Since' },
        { value: '8 Stores + 1 HO', label: 'Management Scale' },
        { value: '1 SKU', label: 'Centralized Standard' },
        { value: 'UNIKOM', label: 'Informatics Eng.' },
      ],
      skillsLabel: 'COMPLETE EXPERTISE: SOFTWARE, DATABASE & HARDWARE',
      skillsTitle: 'TECH STACK, INFRASTRUCTURE & DATABASES',
    },
    works: {
      label: 'REAL CASE STUDIES',
      title: 'FEATURED SYSTEMS & SOLUTIONS',
      viewAll: 'All Projects',
      activeBadge: 'RETAIL SYSTEM',
      viewProject: 'View Case Study',
      stackLabel: 'TECH STACK',
      prev: 'Previous',
      next: 'Next',
      projects: [
        {
          id: 1,
          title: 'RETAIL ATTENDANCE & HR SYSTEM v2.0',
          category: 'MOBILE APP (FLUTTER / CAPACITOR) & BACKOFFICE',
          description: 'Cross-platform mobile attendance application featuring real-time geolocation validation, anti-mock selfie verification, and Laravel backoffice approval workflows.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
          tags: ['Flutter', 'Capacitor Mobile', 'React.js', 'Laravel', 'MySQL', 'Tailwind CSS'],
          link: '#',
          impact: 'Deployed across multi-store retail staff with 100% real-time attendance accuracy',
        },
        {
          id: 2,
          title: 'CENTRALIZED RETAIL BACKOFFICE & MASTER SKU ENGINE',
          category: 'ENTERPRISE RETAIL ERP',
          description: 'Transitioned distributed branch databases into a centralized Head Office architecture, universal 1 Item = 1 SKU harmonization, inter-branch mutation workflows, and stock opname routines.',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
          tags: ['Laravel', 'PHP', 'SQL Server', 'Stored Procedure', 'REST API'],
          link: '#',
          impact: 'Eliminated SKU discrepancies and synchronized operations across 8 retail stores',
        },
        {
          id: 3,
          title: 'MULTI-TENANT LAUNDRY SAAS PLATFORM',
          category: 'CLOUD SAAS ARCHITECTURE',
          description: 'Automated multi-tenant cloud platform: customer registers ➔ system automatically provisions store subdomain ➔ tenant-specific POS & Dashboard login ➔ Superadmin oversight.',
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
          tags: ['Node.js', 'Express', 'React.js', 'Subdomain Engine', 'MySQL'],
          link: '#',
          impact: 'Automated digital store provisioning and multi-branch business management',
        },
        {
          id: 4,
          title: 'ESTEHATAN POS & SMART WHATSAPP LOYALTY',
          category: 'POS & UMKM DIGITALIZATION',
          description: 'Web POS cashier platform with Customer View display, instant member registration via WhatsApp phone numbers, and Bluetooth thermal receipt printing.',
          image: 'https://images.unsplash.com/photo-1556742049-0a67e557b683?q=80&w=800&auto=format&fit=crop',
          tags: ['React.js', 'Web POS', 'Bluetooth Thermal', 'WhatsApp Engine', 'Tailwind'],
          link: '#',
          impact: 'Accelerated cashier checkout speed and boosted customer retention via member points',
        },
      ],
    },
    services: {
      label: 'IMPLEMENTATION WORKFLOW',
      title1: 'DEVELOPMENT STAGES OF',
      title2: 'RETAIL SOFTWARE & SYSTEMS',
      stages: [
        {
          number: '01',
          title: 'BUSINESS PROCESS & OPERATIONAL AUDIT',
          description: 'Auditing retail store floor workflows (cashier, warehouse, purchasing), on-field bottleneck mapping, branch integration needs, and SLA definition.',
          deliverables: ['Business Flow Diagram', 'System Scope Document', 'Feature Specs', 'Implementation Roadmap'],
        },
        {
          number: '02',
          title: 'DATABASE DESIGN & SKU STANDARDIZATION',
          description: 'Designing relational database ERDs (SQL Server / MySQL), universal 1 SKU standardization, high-throughput stored procedures, and REST API contracts.',
          deliverables: ['Database ERD Schema', 'SKU & Supplier Standardization', 'API Contract Spec', 'Security Role Matrix'],
        },
        {
          number: '03',
          title: 'PROTOTYPING & STORE UI/UX WORKFLOW',
          description: 'Designing clean, high-speed mobile APK (Flutter/React) and backoffice layouts tailored for rapid operation by store cashiers with minimal learning curve.',
          deliverables: ['Mobile & Web Wireframes', 'Backoffice UI Layouts', 'Interactive Prototype', 'Design System UI'],
        },
        {
          number: '04',
          title: 'FULL STACK & MOBILE DEVELOPMENT (FLUTTER/LARAVEL)',
          description: 'Building scalable Laravel/Node.js backends and clean Flutter / Capacitor mobile APKs with maintainable architectures and secure middleware.',
          deliverables: ['Clean Laravel & Flutter Codebase', 'Mobile APK Build', 'Database Stored Procedures', 'Security Middleware'],
        },
        {
          number: '05',
          title: 'UAT, STOCK OPNAME & BRANCH INTEGRATION',
          description: 'Rigorous User Acceptance Testing (UAT), field stock opname simulations, geolocation attendance testing, and multi-branch load testing.',
          deliverables: ['UAT Sign-Off', 'Stock Opname SOP', 'Bug Fixing Log', 'Multi-Branch Pilot Test'],
        },
        {
          number: '06',
          title: 'PRODUCTION DEPLOYMENT, CCTV/NETWORKING & ONBOARDING',
          description: 'Live production deployment (VPS / On-Premise), daily automated database backups, network/CCTV integration, operational SOPs, and staff training.',
          deliverables: ['Production Deployment', 'Automated DB Backup', 'User Manual / SOP', 'Maintenance Support'],
        },
      ],
    },
    footer: {
      label: "LET'S COLLABORATE",
      title: 'READY TO BUILD & OPTIMIZE YOUR SYSTEM',
      description: 'Looking to build integrated retail software, Flutter mobile apps, centralized database architectures, or IT infrastructure consulting? Let\'s connect.',
      navTitle: '// NAVIGATION',
      socialsTitle: '// DIGITAL PLATFORMS & LINKS',
      copyright: '© 2026 Septian, S.Kom. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('portfolio_lang') || 'id';
  });

  const [profile, setProfile] = useState(defaultProfile);
  const [allTranslations, setAllTranslations] = useState(defaultTranslations);

  const loadData = async () => {
    try {
      const data = await fetchPortfolioData();
      if (data?.profile) setProfile(data.profile);
      if (data?.translations) setAllTranslations(data.translations);
    } catch (err) {
      // Fallback already handled inside fetchPortfolioData
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = allTranslations[lang] || allTranslations.id || defaultTranslations.id;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, profile, reloadPortfolioData: loadData }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
