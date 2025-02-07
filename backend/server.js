const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/earthquakes', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 