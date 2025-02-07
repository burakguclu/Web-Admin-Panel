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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { fetchCities, updateCityRiskLevel } from '../services/cityService';

function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoading(true);
      const data = await fetchCities();
      setCities(data);
    } catch (err) {
      setError('Şehir verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskLevelChange = async (cityId, newRiskLevel) => {
    try {
      await updateCityRiskLevel(cityId, newRiskLevel);
      loadCities(); // Verileri yenile
    } catch (err) {
      setError('Risk seviyesi güncellenirken bir hata oluştu.');
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return '#ff1744';
      case 'medium': return '#ff9100';
      case 'low': return '#00c853';
      default: return '#00c853';
    }
  };

  // Filtreleme ve sıralama fonksiyonları
  const filteredCities = cities
    .filter(city => 
      city.name.toLowerCase().includes(filter.toLowerCase()) ||
      city.region.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'population') return b.population - a.population;
      if (sortBy === 'risk') {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      return 0;
    });

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
        Şehirler
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Şehir</TableCell>
              <TableCell>Bölge</TableCell>
              <TableCell align="right">Nüfus</TableCell>
              <TableCell align="right">Koordinatlar</TableCell>
              <TableCell align="center">Risk Seviyesi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.region}</TableCell>
                <TableCell align="right">
                  {city.population?.toLocaleString('tr-TR')}
                </TableCell>
                <TableCell align="right">
                  {city.latitude}°N / {city.longitude}°E
                </TableCell>
                <TableCell align="center">
                  <FormControl size="small">
                    <Select
                      value={city.riskLevel}
                      onChange={(e) => handleRiskLevelChange(city.id, e.target.value)}
                      sx={{
                        bgcolor: getRiskLevelColor(city.riskLevel),
                        color: 'white',
                        '& .MuiSelect-icon': { color: 'white' }
                      }}
                    >
                      <MenuItem value="low">Düşük</MenuItem>
                      <MenuItem value="medium">Orta</MenuItem>
                      <MenuItem value="high">Yüksek</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Cities; 