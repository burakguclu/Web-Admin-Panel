import axios from 'axios';

const API_URL = 'http://localhost:5000/api/earthquakes';

export const parseEarthquakeData = (text) => {
  try {
    // Header'ı atlayıp veri satırlarını al
    const lines = text.split('\n')
      .filter(line => line.trim())
      .slice(6); // İlk 6 satırı atla (header bilgileri)

    return lines
      .filter(line => line.includes('2024') || line.includes('2025')) // Sadece deprem verilerini al
      .map(line => {
        try {
          const parts = line.trim().split(/\s+/);
          
          // Tarih ve saat bilgilerini al
          const date = parts[0];
          const time = parts[1];
          
          // Koordinat bilgilerini al
          const latitude = parseFloat(parts[2]);
          const longitude = parseFloat(parts[3]);
          const depth = parseFloat(parts[4]);
          
          // Büyüklük değerlerini al
          const md = parts[5] === '-.-' ? null : parseFloat(parts[5]);
          const ml = parts[6] === '-.-' ? null : parseFloat(parts[6]);
          const mw = parts[7] === '-.-' ? null : parseFloat(parts[7]);
          
          // Konum bilgisini al
          const location = parts.slice(8).join(' ').split('İlksel')[0].trim();

          // En yüksek büyüklük değerini hesapla
          const magnitudes = [md, ml, mw].filter(m => m !== null);
          const maxMagnitude = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;

          return {
            id: `${date}-${time}`,
            date,
            time,
            latitude,
            longitude,
            depth,
            magnitude: { md, ml, mw },
            maxMagnitude,
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
    const response = await axios.get(API_URL);
    return parseEarthquakeData(response.data);
  } catch (error) {
    console.error('Deprem verileri çekilirken hata oluştu:', error);
    throw error;
  }
}; 