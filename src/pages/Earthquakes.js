import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchEarthquakes } from '../services/earthquakeService';

function Earthquakes() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEarthquakes = async () => {
      try {
        setLoading(true);
        const data = await fetchEarthquakes();
        // Magnitude'u number'a çevir
        const formattedData = data.map(eq => ({
          ...eq,
          magnitude: parseFloat(eq.magnitude) || 0
        }));
        setEarthquakes(formattedData);
      } catch (err) {
        setError('Deprem verileri yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEarthquakes();
  }, []);

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
      <Typography variant="h5" component="h2" gutterBottom>
        Son Depremler
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tarih</TableCell>
              <TableCell>Saat</TableCell>
              <TableCell>Konum</TableCell>
              <TableCell align="right">Büyüklük</TableCell>
              <TableCell align="right">Derinlik (km)</TableCell>
              <TableCell align="right">Enlem</TableCell>
              <TableCell align="right">Boylam</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earthquakes.map((earthquake) => (
              <TableRow 
                key={`${earthquake.date}-${earthquake.latitude}-${earthquake.longitude}`}
                sx={{
                  backgroundColor: 
                    earthquake.magnitude >= 4.0 ? 'rgba(255, 0, 0, 0.1)' :
                    earthquake.magnitude >= 3.0 ? 'rgba(255, 165, 0, 0.1)' : 
                    'inherit'
                }}
              >
                <TableCell>
                  {new Date(earthquake.date).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  {new Date(earthquake.date).toLocaleTimeString('tr-TR')}
                </TableCell>
                <TableCell>{earthquake.location}</TableCell>
                <TableCell align="right">
                  {earthquake.magnitude.toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(earthquake.depth).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(earthquake.latitude).toFixed(4)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(earthquake.longitude).toFixed(4)}
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