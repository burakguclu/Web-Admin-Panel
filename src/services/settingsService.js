import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Local storage keys
const THEME_MODE_KEY = 'themeMode';

export const getThemeMode = () => {
  return localStorage.getItem(THEME_MODE_KEY) === 'dark' ? 'dark' : 'light';
};

export const setThemeMode = (mode) => {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
    // Tema değişikliğini event olarak yayınla
    window.dispatchEvent(new Event('themeChange'));
    return true;
  } catch (error) {
    console.error('Tema ayarı kaydedilirken hata:', error);
    return false;
  }
};

export const saveSettings = async (settings) => {
  try {
    const mode = settings.display.darkMode ? 'dark' : 'light';
    const success = setThemeMode(mode);
    if (!success) {
      throw new Error('Tema ayarı kaydedilemedi');
    }
    return true;
  } catch (error) {
    console.error('Ayarlar kaydedilirken hata:', error);
    throw error;
  }
}; 