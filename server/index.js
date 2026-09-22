import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Helper to read data safely
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data.json:', err);
    return null;
  }
}

// Helper to write data safely
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing data.json:', err);
    return false;
  }
}

// Helper: Translate Single String (ID -> EN)
async function translateText(text, sl = 'id', tl = 'en') {
  if (!text || typeof text !== 'string') return text;
  if (!text.trim()) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const json = await response.json();
    if (json && json[0]) {
      return json[0].map(item => item[0]).join('');
    }
    return text;
  } catch (err) {
    console.warn(`Translation fallback for "${text}":`, err.message);
    return text;
  }
}

// Helper: Translate Deep Object Recursively
async function translateDeep(input) {
  if (typeof input === 'string') {
    return await translateText(input);
  }
  if (Array.isArray(input)) {
    const translatedArr = [];
    for (const item of input) {
      translatedArr.push(await translateDeep(item));
    }
    return translatedArr;
  }
  if (typeof input === 'object' && input !== null) {
    const translatedObj = {};
    for (const [key, value] of Object.entries(input)) {
      // Don't translate specific technical keys or paths
      if (['image', 'link', 'icon', 'id', 'github', 'linkedin', 'twitter', 'dribbble', 'lynkid', 'photoUrl', 'cvUrl', 'email', 'number'].includes(key)) {
        translatedObj[key] = value;
      } else {
        translatedObj[key] = await translateDeep(value);
      }
    }
    return translatedObj;
  }
  return input;
}

// Routes

// 1. Get Portfolio Data (Public)
app.get('/api/portfolio', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read database.' });
  }
  const { pin, ...publicData } = data;
  res.json(publicData);
});

// 2. Admin Login (Verifies PIN)
app.post('/api/login', (req, res) => {
  const { pin } = req.body;
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Database unavailable.' });
  }

  if (data.pin && data.pin === pin) {
    return res.json({ success: true, token: 'session-' + Date.now(), message: 'Login successful' });
  }

  return res.status(401).json({ success: false, error: 'PIN tidak sesuai. Silakan coba lagi.' });
});

// 3. Change Admin PIN
app.post('/api/change-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Database unavailable.' });
  }

  if (data.pin !== currentPin) {
    return res.status(401).json({ error: 'PIN lama salah.' });
  }

  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'PIN baru minimal 4 karakter.' });
  }

  data.pin = newPin;
  if (writeData(data)) {
    return res.json({ success: true, message: 'PIN berhasil diubah.' });
  }

  return res.status(500).json({ error: 'Gagal menyimpan PIN baru.' });
});

// 4. Auto-Translate Endpoint (Manual or Bulk)
app.post('/api/translate', async (req, res) => {
  const { data: inputData, text } = req.body;

  if (text) {
    const translated = await translateText(text);
    return res.json({ success: true, translated });
  }

  if (inputData) {
    const translated = await translateDeep(inputData);
    return res.json({ success: true, translated });
  }

  return res.status(400).json({ error: 'No text or data provided for translation.' });
});

// 5. Update Portfolio Data (Admin with Auto-Translate support)
app.put('/api/portfolio', async (req, res) => {
  const { profile, translations, autoTranslate = true } = req.body;
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Database unavailable.' });
  }

  if (profile) data.profile = profile;

  if (translations) {
    data.translations = data.translations || {};
    if (translations.id) {
      data.translations.id = translations.id;
      
      // Auto translate ID -> EN if requested or if translations.en is omitted/synced
      if (autoTranslate) {
        try {
          console.log('Generating automatic English translation from Indonesian input...');
          data.translations.en = await translateDeep(translations.id);
        } catch (tErr) {
          console.warn('Auto translation failed, preserving existing EN:', tErr);
          if (translations.en) data.translations.en = translations.en;
        }
      } else if (translations.en) {
        data.translations.en = translations.en;
      }
    } else if (translations.en) {
      data.translations.en = translations.en;
    }
  }

  if (writeData(data)) {
    return res.json({ 
      success: true, 
      message: 'Data portofolio berhasil disimpan & diterjemahkan otomatis ke Bahasa Inggris.',
      translations: data.translations
    });
  }

  return res.status(500).json({ error: 'Gagal menyimpan data ke database.' });
});

// 6. Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    message: 'File berhasil diunggah.',
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio API Server with Auto-Translate running on http://localhost:${PORT}`);
});
