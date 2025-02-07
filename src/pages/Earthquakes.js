import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchEarthquakes } from '../services/earthquakeService';

function Earthquakes() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEarthquakes = async () => {
      try {
        const data = await fetchEarthquakes();
        setEarthquakes(data);
        setLoading(false);
      } catch (err) {
        setError('Deprem verileri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    getEarthquakes();
  }, []);

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 4.0) return '#ff1744';
    if (magnitude >= 3.0) return '#ff9100';
    return '#4caf50';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const lastBigEarthquake = earthquakes
    .filter(eq => eq.maxMagnitude >= 4.0)
    .sort((a, b) => b.maxMagnitude - a.maxMagnitude)[0];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Son Depremler
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son 24 Saat
              </Typography>
              <Typography variant="h3" color="primary">
                {earthquakes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Deprem Sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                En Şiddetli Deprem
              </Typography>
              <Typography variant="h3" color="error">
                {lastBigEarthquake?.maxMagnitude.toFixed(1) || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lastBigEarthquake?.location || '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ortalama Derinlik
              </Typography>
              <Typography variant="h3" color="info.main">
                {(earthquakes.reduce((acc, eq) => acc + eq.depth, 0) / earthquakes.length).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                kilometre
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tarih/Saat</TableCell>
              <TableCell>Konum</TableCell>
              <TableCell align="right">Büyüklük</TableCell>
              <TableCell align="right">Derinlik</TableCell>
              <TableCell align="right">Enlem/Boylam</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earthquakes.map((earthquake) => (
              <TableRow key={earthquake.id}>
                <TableCell>
                  {earthquake.date} {earthquake.time}
                </TableCell>
                <TableCell>{earthquake.location}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={earthquake.maxMagnitude.toFixed(1)}
                    size="small"
                    sx={{
                      bgcolor: getMagnitudeColor(earthquake.maxMagnitude),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell align="right">{earthquake.depth} km</TableCell>
                <TableCell align="right">
                  {earthquake.latitude}°N / {earthquake.longitude}°E
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Earthquakes; 