import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const parseEarthquakeData = (text) => {
  try {
    const lines = text.split('\n')
      .filter(line => line.trim())
      .slice(6);

    return lines
      .filter(line => line.includes('2024') || line.includes('2025'))
      .map((line, index) => {
        try {
          const parts = line.trim().split(/\s+/);
          
          const date = parts[0];
          const time = parts[1];
          const latitude = parseFloat(parts[2]);
          const longitude = parseFloat(parts[3]);
          const depth = parseFloat(parts[4]);
          const md = parts[5] === '-.-' ? null : parseFloat(parts[5]);
          const ml = parts[6] === '-.-' ? null : parseFloat(parts[6]);
          const mw = parts[7] === '-.-' ? null : parseFloat(parts[7]);
          const location = parts.slice(8).join(' ').split('İlksel')[0].trim();

          const magnitudes = [md, ml, mw].filter(m => m !== null);
          const maxMagnitude = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;

          return {
            id: `${date}-${time}-${latitude}-${longitude}`,
            date,
            time,
            latitude,
            longitude,
            depth,
            magnitude: maxMagnitude,
            location
          };
        } catch (err) {
          console.error('Satır ayrıştırma hatası:', err);
          return null;
        }
      })
      .filter(item => item !== null);
  } catch (err) {
    console.error('Veri ayrıştırma hatası:', err);
    return [];
  }
};

export const fetchEarthquakes = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes`);
    return response.data;
  } catch (error) {
    console.error('Deprem verileri çekilirken hata oluştu:', error);
    throw error;
  }
};

export const fetchDailyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes/stats/daily`);
    return response.data;
  } catch (error) {
    console.error('Günlük istatistikler çekilirken hata oluştu:', error);
    throw error;
  }
};

export const fetchRegionStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes/stats/regions`);
    return response.data;
  } catch (error) {
    console.error('Bölge istatistikleri çekilirken hata oluştu:', error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes/stats/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Dashboard istatistikleri çekilirken hata oluştu:', error);
    throw error;
  }
};