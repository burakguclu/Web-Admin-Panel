import React from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ayarlar
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sistem Ayarları
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Karanlık Mod"
          />
          
          <FormControlLabel
            control={<Switch />}
            label="E-posta Bildirimleri"
          />
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="İki Faktörlü Doğrulama"
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings; 