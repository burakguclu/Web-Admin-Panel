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
  Alert,
  Button
} from '@mui/material';
import { fetchEarthquakes } from '../services/earthquakeService';

function Earthquakes() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEarthquakes = async () => {
    try {
      setLoading(true);
      const data = await fetchEarthquakes();
      setEarthquakes(data);
    } catch (err) {
      setError('Deprem verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarthquakes();
  }, []);

  const handleRefresh = () => {
    loadEarthquakes();
  };

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 4.0) return '#ff1744';
    if (magnitude >= 3.0) return '#ff9100';
    return '#00c853';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Son Depremler
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'Yenile'}
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Deprem
              </Typography>
              <Typography variant="h4">
                {earthquakes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Şiddetli Deprem
              </Typography>
              <Typography variant="h4">
                {Math.max(...earthquakes.map(eq => eq.magnitude)).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ortalama Derinlik
              </Typography>
              <Typography variant="h4">
                {(earthquakes.reduce((acc, eq) => acc + eq.depth, 0) / earthquakes.length).toFixed(1)} km
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
                    label={earthquake.magnitude.toFixed(1)}
                    size="small"
                    sx={{
                      bgcolor: getMagnitudeColor(earthquake.magnitude),
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