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
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Battery20 as BatteryLowIcon,
  Battery90 as BatteryFullIcon,
  SignalCellular1Bar as SignalLowIcon,
  SignalCellular4Bar as SignalFullIcon,
  Build as MaintenanceIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { fetchDevices, updateDeviceStatus, updateDeviceMaintenance } from '../services/deviceService';

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await fetchDevices();
      setDevices(data);
    } catch (err) {
      setError('Cihaz verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleStatusChange = async (deviceId, newStatus) => {
    try {
      await updateDeviceStatus(deviceId, newStatus);
      loadDevices();
    } catch (err) {
      setError('Cihaz durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleMaintenance = async (deviceId) => {
    try {
      await updateDeviceMaintenance(deviceId);
      loadDevices();
    } catch (err) {
      setError('Bakım kaydı güncellenirken bir hata oluştu.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00c853';
      case 'inactive': return '#d32f2f';
      case 'maintenance': return '#ff9100';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <ActiveIcon />;
      case 'inactive': return <InactiveIcon />;
      case 'maintenance': return <MaintenanceIcon />;
      default: return null;
    }
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
      <Typography variant="h5" component="h2" gutterBottom>
        Deprem İzleme Cihazları
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Cihaz
              </Typography>
              <Typography variant="h4">
                {devices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Aktif Cihazlar
              </Typography>
              <Typography variant="h4" sx={{ color: '#00c853' }}>
                {devices.filter(d => d.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Bakımda Olan Cihazlar
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9100' }}>
                {devices.filter(d => d.status === 'maintenance').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Düşük Pil Seviyesi
              </Typography>
              <Typography variant="h4" sx={{ color: '#d32f2f' }}>
                {devices.filter(d => d.battery_level < 20).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cihaz Adı</TableCell>
              <TableCell>Konum</TableCell>
              <TableCell>Şehir</TableCell>
              <TableCell align="center">Durum</TableCell>
              <TableCell align="center">Pil</TableCell>
              <TableCell align="center">Sinyal</TableCell>
              <TableCell align="center">Son Bakım</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <Typography variant="subtitle2">{device.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {device.device_type}
                  </Typography>
                </TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>{device.city_name}</TableCell>
                <TableCell align="center">
                  <Chip
                    icon={getStatusIcon(device.status)}
                    label={device.status.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(device.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={`${device.battery_level}%`}>
                    <Box>
                      {device.battery_level < 20 ? (
                        <BatteryLowIcon color="error" />
                      ) : (
                        <BatteryFullIcon color="success" />
                      )}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={`${device.signal_strength}%`}>
                    <Box>
                      {device.signal_strength < 50 ? (
                        <SignalLowIcon color="error" />
                      ) : (
                        <SignalFullIcon color="success" />
                      )}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  {new Date(device.last_maintenance_date).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Bakım Yap">
                    <IconButton
                      size="small"
                      onClick={() => handleMaintenance(device.id)}
                      color="primary"
                    >
                      <MaintenanceIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={device.status === 'active' ? 'Devre Dışı Bırak' : 'Aktifleştir'}>
                    <IconButton
                      size="small"
                      onClick={() => handleStatusChange(device.id, device.status === 'active' ? 'inactive' : 'active')}
                      color={device.status === 'active' ? 'error' : 'success'}
                    >
                      {device.status === 'active' ? <InactiveIcon /> : <ActiveIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Devices; 