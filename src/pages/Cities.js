import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

function Cities() {
  const cities = [
    { id: 1, name: 'İstanbul', population: '15.84M', region: 'Marmara' },
    { id: 2, name: 'Ankara', population: '5.66M', region: 'İç Anadolu' },
    { id: 3, name: 'İzmir', population: '4.40M', region: 'Ege' },
    { id: 4, name: 'Bursa', population: '3.15M', region: 'Marmara' },
    { id: 5, name: 'Antalya', population: '2.62M', region: 'Akdeniz' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Şehirler
      </Typography>
      
      <Grid container spacing={3}>
        {cities.map((city) => (
          <Grid item xs={12} md={4} key={city.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {city.name}
                </Typography>
                <Typography color="text.secondary">
                  Nüfus: {city.population}
                </Typography>
                <Typography color="text.secondary">
                  Bölge: {city.region}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Cities; 