import React, { useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';

function Earthquakes() {
  const [timeFilter, setTimeFilter] = useState('24h');

  // Örnek deprem verileri
  const earthquakes = [
    {
      id: 1,
      location: 'Kahramanmaraş, Pazarcık',
      magnitude: 4.2,
      depth: 7.4,
      date: '2024-02-15 14:23',
      intensity: 'Orta',
    },
    {
      id: 2,
      location: 'İzmir, Seferihisar',
      magnitude: 3.8,
      depth: 5.2,
      date: '2024-02-15 12:45',
      intensity: 'Hafif',
    },
    {
      id: 3,
      location: 'Muğla, Datça',
      magnitude: 4.5,
      depth: 8.1,
      date: '2024-02-15 10:15',
      intensity: 'Orta',
    },
    {
      id: 4,
      location: 'Van, Erciş',
      magnitude: 3.2,
      depth: 4.8,
      date: '2024-02-15 09:30',
      intensity: 'Hafif',
    },
    {
      id: 5,
      location: 'Manisa, Akhisar',
      magnitude: 4.8,
      depth: 9.2,
      date: '2024-02-15 08:15',
      intensity: 'Şiddetli',
    },
  ];

  // İstatistik verileri
  const statsData = [
    { name: '00-06', depremSayisi: 8 },
    { name: '06-12', depremSayisi: 12 },
    { name: '12-18', depremSayisi: 15 },
    { name: '18-24', depremSayisi: 10 },
  ];

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 4.5) return '#ff1744';
    if (magnitude >= 4.0) return '#ff9100';
    return '#4caf50';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Deprem İzleme Merkezi
      </Typography>

      <Grid container spacing={3}>
        {/* Özet Kartları */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son 24 Saat
              </Typography>
              <Typography variant="h3" color="primary">
                45
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Deprem Sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                En Şiddetli Deprem
              </Typography>
              <Typography variant="h3" color="error">
                4.8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manisa, Akhisar
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ortalama Derinlik
              </Typography>
              <Typography variant="h3" color="info.main">
                7.2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                kilometre
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafik */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Saatlik Deprem Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="depremSayisi" fill="#2196f3" name="Deprem Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Filtreler ve Tablo */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '400px', overflow: 'auto' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Bölgeleri
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  icon={<WarningIcon />}
                  label="Kahramanmaraş - Yüksek Risk"
                  color="error"
                />
                <Chip
                  icon={<WarningIcon />}
                  label="İzmir - Orta Risk"
                  color="warning"
                />
                <Chip
                  icon={<WarningIcon />}
                  label="Van - Orta Risk"
                  color="warning"
                />
                <Chip
                  icon={<WarningIcon />}
                  label="Muğla - Düşük Risk"
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Deprem Listesi */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Son Depremler
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Zaman Aralığı</InputLabel>
                  <Select
                    value={timeFilter}
                    label="Zaman Aralığı"
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <MenuItem value="24h">Son 24 Saat</MenuItem>
                    <MenuItem value="48h">Son 48 Saat</MenuItem>
                    <MenuItem value="7d">Son 7 Gün</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Konum</TableCell>
                      <TableCell align="right">Büyüklük</TableCell>
                      <TableCell align="right">Derinlik (km)</TableCell>
                      <TableCell align="right">Tarih/Saat</TableCell>
                      <TableCell align="right">Şiddet</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earthquakes.map((quake) => (
                      <TableRow key={quake.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon color="action" />
                            {quake.location}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={quake.magnitude}
                            size="small"
                            sx={{
                              bgcolor: getMagnitudeColor(quake.magnitude),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">{quake.depth}</TableCell>
                        <TableCell align="right">{quake.date}</TableCell>
                        <TableCell align="right">{quake.intensity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Earthquakes; 