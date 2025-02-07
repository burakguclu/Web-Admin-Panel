const express = require('express');
const router = express.Router();
const db = require('../models');
const { Sequelize } = require('sequelize');

// Tüm cihazları getir
router.get('/', async (req, res) => {
  try {
    const devices = await db.sequelize.query(`
      SELECT d.*, c.name as city_name 
      FROM devices d
      LEFT JOIN cities c ON d.city_id = c.id
      ORDER BY d.name ASC
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(devices);
  } catch (error) {
    console.error('Cihaz verilerini çekerken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cihaz durumunu güncelle
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.sequelize.query(`
      UPDATE devices 
      SET status = :status, 
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = :id
    `, {
      replacements: { id, status },
      type: Sequelize.QueryTypes.UPDATE
    });

    const [updatedDevice] = await db.sequelize.query(`
      SELECT * FROM devices WHERE id = :id
    `, {
      replacements: { id },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(updatedDevice);
  } catch (error) {
    console.error('Cihaz durumu güncellenirken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Bakım tarihini güncelle
router.put('/:id/maintenance', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.sequelize.query(`
      UPDATE devices 
      SET last_maintenance_date = CURRENT_TIMESTAMP,
          status = 'active',
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = :id
    `, {
      replacements: { id },
      type: Sequelize.QueryTypes.UPDATE
    });

    const [updatedDevice] = await db.sequelize.query(`
      SELECT * FROM devices WHERE id = :id
    `, {
      replacements: { id },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(updatedDevice);
  } catch (error) {
    console.error('Bakım tarihi güncellenirken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// İstatistikleri getir
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.sequelize.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_devices,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_devices,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_devices,
        COUNT(CASE WHEN battery_level < 20 THEN 1 END) as low_battery_devices,
        COUNT(CASE WHEN signal_strength < 50 THEN 1 END) as low_signal_devices
      FROM devices
    `, {
      type: Sequelize.QueryTypes.SELECT
    });

    res.json(stats);
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Şehre göre cihazları getir
router.get('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const devices = await db.sequelize.query(`
      SELECT d.*, c.name as city_name 
      FROM devices d
      LEFT JOIN cities c ON d.city_id = c.id
      WHERE d.city_id = :cityId
      ORDER BY d.name ASC
    `, {
      replacements: { cityId },
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(devices);
  } catch (error) {
    console.error('Şehir cihazları alınırken hata:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 