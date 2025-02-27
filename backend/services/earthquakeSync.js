const axios = require('axios');
const db = require('../models');
const { Sequelize } = require('sequelize');

const parseEarthquakeData = (text) => {
  try {
    const lines = text.split('\n')
      .filter(line => line.trim())
      .slice(6);

    return lines
      .filter(line => line.includes('2024') || line.includes('2025'))
      .map(line => {
        try {
          const parts = line.trim().split(/\s+/);
          
          // Tarih ve saat kontrolü
          const date = parts[0];
          const time = parts[1];
          const dateObj = new Date(`${date} ${time}`);
          if (isNaN(dateObj.getTime())) {
            console.error('Geçersiz tarih:', date, time);
            return null;
          }

          // Koordinat kontrolü
          const latitude = parseFloat(parts[2]);
          const longitude = parseFloat(parts[3]);
          if (isNaN(latitude) || isNaN(longitude)) {
            console.error('Geçersiz koordinatlar:', parts[2], parts[3]);
            return null;
          }

          // Diğer sayısal değerlerin kontrolü
          const depth = parseFloat(parts[4]);
          const md = parts[5] === '-.-' ? null : parseFloat(parts[5]);
          const ml = parts[6] === '-.-' ? null : parseFloat(parts[6]);
          const mw = parts[7] === '-.-' ? null : parseFloat(parts[7]);

          if (isNaN(depth)) {
            console.error('Geçersiz derinlik:', parts[4]);
            return null;
          }

          const location = parts.slice(8).join(' ')
            .split('İlksel')[0]
            .replace(/[()]/g, '')
            .trim()
            .toUpperCase();

          const magnitudes = [md, ml, mw].filter(m => m !== null && !isNaN(m));
          const maxMagnitude = magnitudes.length > 0 ? Math.max(...magnitudes) : null;

          if (maxMagnitude === null) {
            console.error('Geçersiz büyüklük değerleri:', md, ml, mw);
            return null;
          }

          return {
            date: dateObj,
            latitude,
            longitude,
            depth,
            magnitude: maxMagnitude,
            location,
            md,
            ml,
            mw
          };
        } catch (err) {
          console.error('Satır ayrıştırma hatası:', err, 'Satır:', line);
          return null;
        }
      })
      .filter(item => item !== null);
  } catch (err) {
    console.error('Veri ayrıştırma hatası:', err);
    return [];
  }
};

const syncEarthquakes = async () => {
  try {
    console.log('Deprem verileri güncelleniyor...');
    const response = await axios.get('http://koeri.boun.edu.tr/scripts/lst0.asp', {
      responseType: 'arraybuffer'
    });
    
    const data = Buffer.from(response.data).toString('latin1');
    const earthquakes = parseEarthquakeData(data);
    
    // Her bir deprem verisi için
    for (const eq of earthquakes) {
      try {
        // Veri doğrulama
        if (!eq.date || !eq.latitude || !eq.longitude || !eq.magnitude) {
          console.error('Eksik veri:', eq);
          continue;
        }

        // Aynı tarih ve koordinatlara sahip deprem var mı kontrol et
        const [existing] = await db.sequelize.query(`
          SELECT id FROM earthquakes 
          WHERE date = :date 
          AND latitude = :latitude 
          AND longitude = :longitude
        `, {
          replacements: { 
            date: eq.date,
            latitude: eq.latitude,
            longitude: eq.longitude
          },
          type: Sequelize.QueryTypes.SELECT
        });

        if (!existing) {
          // Yeni deprem verisini ekle
          await db.sequelize.query(`
            INSERT INTO earthquakes (
              date, latitude, longitude, depth, magnitude, 
              location, md, ml, mw, "createdAt", "updatedAt"
            ) VALUES (
              :date, :latitude, :longitude, :depth, :magnitude,
              :location, :md, :ml, :mw, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
          `, {
            replacements: eq,
            type: Sequelize.QueryTypes.INSERT
          });
        }
      } catch (err) {
        console.error('Deprem verisi eklenirken hata:', err, 'Veri:', eq);
        continue;
      }
    }
    
    console.log('Deprem verileri güncellendi');
  } catch (error) {
    console.error('Deprem verileri güncellenirken hata:', error);
  }
};

// İlk senkronizasyonu yap
syncEarthquakes();

// Her 5 dakikada bir senkronize et
setInterval(syncEarthquakes, 5 * 60 * 1000);

module.exports = { syncEarthquakes }; 