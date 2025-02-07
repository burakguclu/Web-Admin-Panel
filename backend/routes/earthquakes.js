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

module.exports = router;