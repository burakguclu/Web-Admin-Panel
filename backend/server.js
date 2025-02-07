require('dotenv').config();
const express = require('express');
const cors = require('cors');
const earthquakesRouter = require('./routes/earthquakes');
const citiesRouter = require('./routes/cities');
const devicesRouter = require('./routes/devices');
require('./services/earthquakeSync');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/earthquakes', earthquakesRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/devices', devicesRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 