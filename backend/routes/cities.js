const express = require('express');
const router = express.Router();
const db = require('../models');
const { Sequelize } = require('sequelize');

// Tüm şehirleri getir
router.get('/', async (req, res) => {
  try {
    const cities = await db.sequelize.query(`
      SELECT * FROM cities ORDER BY name ASC
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(cities);
  } catch (error) {
    console.error('Şehir verilerini çekerken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Risk seviyesini güncelle
router.put('/:id/risk-level', async (req, res) => {
  try {
    const { id } = req.params;
    const { riskLevel } = req.body;

    await db.sequelize.query(`
      UPDATE cities 
      SET "riskLevel" = :riskLevel 
      WHERE id = :id
    `, {
      replacements: { id, riskLevel },
      type: Sequelize.QueryTypes.UPDATE
    });

    const [updatedCity] = await db.sequelize.query(`
      SELECT * FROM cities WHERE id = :id
    `, {
      replacements: { id },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(updatedCity);
  } catch (error) {
    console.error('Risk seviyesi güncellenirken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// İstatistikleri getir
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.sequelize.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN "riskLevel" = 'high' THEN 1 END) as "highRisk",
        COUNT(CASE WHEN "riskLevel" = 'medium' THEN 1 END) as "mediumRisk",
        COUNT(CASE WHEN "riskLevel" = 'low' THEN 1 END) as "lowRisk"
      FROM cities
    `, {
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(stats[0]);
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Bölgeye göre şehirleri getir
router.get('/by-region/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const cities = await db.sequelize.query(`
      SELECT * FROM cities 
      WHERE region = :region 
      ORDER BY name ASC
    `, {
      replacements: { region },
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(cities);
  } catch (error) {
    console.error('Bölge şehirleri alınırken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 