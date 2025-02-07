const express = require('express');
const router = express.Router();
const axios = require('axios');

// Kandilli'den deprem verilerini çek
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://koeri.boun.edu.tr/scripts/lst0.asp', {
      responseType: 'arraybuffer'
    });
    
    // Turkish character encoding için
    const data = Buffer.from(response.data).toString('latin1');
    res.send(data);
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    res.status(500).send('Deprem verileri alınamadı');
  }
});

module.exports = router;