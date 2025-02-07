const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/earthquakes', async (req, res) => {
  try {
    const response = await axios.get('http://koeri.boun.edu.tr/scripts/lst0.asp');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Deprem verileri alınamadı');
  }
});

module.exports = router; 