const express = require('express');
const router = express.Router();
const db = require('../models');
const { Sequelize } = require('sequelize');

// Tüm depremleri getir
router.get('/', async (req, res) => {
  try {
    const earthquakes = await db.sequelize.query(`
      SELECT * FROM earthquakes 
      ORDER BY date DESC 
      LIMIT 500
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(earthquakes);
  } catch (error) {
    console.error('Deprem verileri çekilirken hata:', error);
    res.status(500).send('Deprem verileri alınamadı');
  }
});

// Son 24 saatteki deprem istatistiklerini getir
router.get('/stats/daily', async (req, res) => {
  try {
    const stats = await db.sequelize.query(`
      SELECT 
        COUNT(*) as total,
        AVG(magnitude) as avg_magnitude,
        MAX(magnitude) as max_magnitude,
        AVG(depth) as avg_depth,
        COUNT(CASE WHEN magnitude >= 4.0 THEN 1 END) as significant_count
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '24 HOURS'
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bölgelere göre deprem sayılarını getir
router.get('/stats/regions', async (req, res) => {
  try {
    const regions = await db.sequelize.query(`
      SELECT 
        SUBSTRING(location FROM '[^)]+$') as region,
        COUNT(*) as count,
        AVG(magnitude) as avg_magnitude
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '7 DAYS'
      GROUP BY region
      ORDER BY count DESC
      LIMIT 10
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard istatistikleri için endpoint
router.get('/stats/dashboard', async (req, res) => {
  try {
    // Son 24 saat istatistikleri
    const [dailyStats] = await db.sequelize.query(`
      SELECT 
        COUNT(*) as total_count,
        ROUND(AVG(NULLIF(magnitude, 0))::numeric, 1) as avg_magnitude,
        MAX(magnitude) as max_magnitude,
        ROUND(AVG(NULLIF(depth, 0))::numeric, 1) as avg_depth,
        COUNT(CASE WHEN magnitude >= 4.0 THEN 1 END) as significant_count
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '24 HOURS'
    `, { type: Sequelize.QueryTypes.SELECT });

    // Saatlik deprem dağılımı
    const hourlyStats = await db.sequelize.query(`
      SELECT 
        date_trunc('hour', date) as hour,
        COUNT(*) as count,
        ROUND(AVG(NULLIF(magnitude, 0))::numeric, 1) as avg_magnitude
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '24 HOURS'
      GROUP BY hour
      ORDER BY hour
    `, { type: Sequelize.QueryTypes.SELECT });

    // Magnitude dağılımı
    const magnitudeStats = await db.sequelize.query(`
      SELECT 
        FLOOR(COALESCE(magnitude, 0)) as magnitude_range,
        COUNT(*) as count
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '7 DAYS'
        AND magnitude > 0
      GROUP BY magnitude_range
      ORDER BY magnitude_range
    `, { type: Sequelize.QueryTypes.SELECT });

    // Şehir-deprem eşleştirmesi
    const cityEarthquakes = await db.sequelize.query(`
      WITH earthquake_distances AS (
        SELECT 
          c.name,
          e.id,
          (
            6371 * acos(
              cos(radians(c.latitude)) * 
              cos(radians(e.latitude)) * 
              cos(radians(e.longitude) - radians(c.longitude)) + 
              sin(radians(c.latitude)) * 
              sin(radians(e.latitude))
            )
          ) as distance_km
        FROM cities c
        CROSS JOIN earthquakes e
        WHERE e.date >= NOW() - INTERVAL '24 HOURS'
      )
      SELECT 
        name as city,
        COUNT(DISTINCT id) as earthquake_count,
        ROUND(MIN(distance_km)::numeric, 1) as nearest_distance
      FROM earthquake_distances
      WHERE distance_km <= 100
      GROUP BY name
      ORDER BY earthquake_count DESC, nearest_distance ASC
      LIMIT 10
    `, { type: Sequelize.QueryTypes.SELECT });

    res.json({
      dailyStats: dailyStats || { 
        total_count: 0, 
        avg_magnitude: 0, 
        max_magnitude: 0, 
        avg_depth: 0, 
        significant_count: 0 
      },
      hourlyStats: hourlyStats || [],
      magnitudeStats: magnitudeStats || [],
      cityEarthquakes: cityEarthquakes || []
    });

  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Dashboard istatistikleri alınırken hata oluştu',
      error: error.message,
      stack: error.stack
    });
  }
});

// Önce location verilerini kontrol edelim
router.get('/debug/locations', async (req, res) => {
  try {
    const locations = await db.sequelize.query(`
      SELECT DISTINCT location
      FROM earthquakes
      WHERE date >= NOW() - INTERVAL '7 DAYS'
      ORDER BY location;
    `, { type: Sequelize.QueryTypes.SELECT });
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;