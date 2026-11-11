import { supabase } from './supabase';
import { defaultProfile, defaultTranslations } from '../context/LanguageContext';

export async function fetchPortfolioData() {
  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error, using fallback defaults:', error.message);
      return { profile: defaultProfile, translations: defaultTranslations, pin: '123456' };
    }

    if (!data) {
      // Seed table with default data if empty
      try {
        await supabase.from('portfolio_settings').insert({
          id: 'main',
          pin: '123456',
          profile: defaultProfile,
          translations: defaultTranslations,
          updated_at: new Date().toISOString(),
        });
      } catch (seedErr) {
        console.warn('Auto-seed notice:', seedErr.message);
      }
      return { profile: defaultProfile, translations: defaultTranslations, pin: '123456' };
    }

    return {
      profile: data.profile || defaultProfile,
      translations: data.translations || defaultTranslations,
      pin: data.pin || '123456',
    };
  } catch (err) {
    console.warn('Network error connecting to Supabase:', err.message);
    return { profile: defaultProfile, translations: defaultTranslations, pin: '123456' };
  }
}

export async function savePortfolioData(profile, translations) {
  try {
    const { error } = await supabase
      .from('portfolio_settings')
      .upsert({
        id: 'main',
        profile,
        translations,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Failed to save to Supabase:', err);
    throw err;
  }
}

export async function verifyAdminPin(pin) {
  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('pin')
      .eq('id', 'main')
      .maybeSingle();

    if (error || !data) {
      // Fallback default pin
      return pin === '123456';
    }

    return (data.pin || '123456') === pin;
  } catch (err) {
    return pin === '123456';
  }
}

export async function changeAdminPin(currentPin, newPin) {
  try {
    const isValid = await verifyAdminPin(currentPin);
    if (!isValid) {
      return { success: false, error: 'PIN saat ini salah.' };
    }

    const { error } = await supabase
      .from('portfolio_settings')
      .update({ pin: newPin, updated_at: new Date().toISOString() })
      .eq('id', 'main');

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Failed to update PIN in Supabase:', err);
    return { success: false, error: err.message || 'Gagal mengubah PIN.' };
  }
}

export async function uploadMedia(file, folder = 'portfolio') {
  try {
    const ext = file.name.split('.').pop();
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `${folder}/${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return { url: data.publicUrl };
  } catch (err) {
    console.error('Failed to upload file to Supabase Storage:', err);
    throw err;
  }
}
