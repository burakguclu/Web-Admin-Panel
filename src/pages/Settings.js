import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  DataUsage as DataUsageIcon,
  DarkMode as DarkModeIcon,
  Translate as TranslateIcon,
  AccessTime as AccessTimeIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { saveSettings } from '../services/settingsService';
import { usePrompt } from '../hooks/usePrompt';

const Settings = ({ setMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      minMagnitude: 4.0,
      emailNotifications: true,
      pushNotifications: true
    },
    dataSync: {
      interval: 5,
      autoSync: true,
      retryOnFail: true
    },
    display: {
      darkMode: localStorage.getItem('themeMode') === 'dark',
      language: 'tr',
      timeFormat: '24h',
      dateFormat: 'DD.MM.YYYY'
    },
    system: {
      cacheEnabled: true,
      cacheDuration: 24,
      autoCleanup: true,
      debugMode: false
    }
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasUnsavedChanges(true);

    // Karanlık mod değiştiğinde özel uyarı göster
    if (category === 'display' && setting === 'darkMode') {
      setAlertMessage('Tema değişikliğini uygulamak için ayarları kaydetmelisiniz');
      setAlertSeverity('info');
      setShowAlert(true);
    }
  };

  // Sayfa değişimini kontrol et
  usePrompt(
    'Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinize emin misiniz?',
    hasUnsavedChanges
  );

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setMode(settings.display.darkMode ? 'dark' : 'light');
      setAlertMessage('Ayarlar başarıyla kaydedildi');
      setAlertSeverity('success');
      setShowAlert(true);
      setHasUnsavedChanges(false);
    } catch (error) {
      setAlertMessage('Ayarlar kaydedilirken hata oluştu');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const handleSyncNow = async () => {
    try {
      // Manuel senkronizasyon API çağrısı
      setAlertMessage('Veriler başarıyla güncellendi');
      setAlertSeverity('success');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Veri güncellenirken hata oluştu');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ayarlar
      </Typography>

      <Grid container spacing={3}>
        {/* Bildirim Ayarları */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Bildirim Ayarları</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.enabled}
                    onChange={(e) => handleSettingChange('notifications', 'enabled', e.target.checked)}
                  />
                }
                label="Bildirimleri Etkinleştir"
              />
              
              <TextField
                fullWidth
                label="Minimum Deprem Büyüklüğü"
                type="number"
                value={settings.notifications.minMagnitude}
                onChange={(e) => handleSettingChange('notifications', 'minMagnitude', parseFloat(e.target.value))}
                sx={{ mt: 2 }}
                inputProps={{ step: 0.1 }}
                disabled={!settings.notifications.enabled}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                }
                label="E-posta Bildirimleri"
                disabled={!settings.notifications.enabled}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  />
                }
                label="Push Bildirimleri"
                disabled={!settings.notifications.enabled}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Veri Senkronizasyon Ayarları */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DataUsageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Veri Senkronizasyonu</Typography>
                <Tooltip title="Şimdi Güncelle">
                  <IconButton 
                    onClick={handleSyncNow}
                    sx={{ ml: 'auto' }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataSync.autoSync}
                    onChange={(e) => handleSettingChange('dataSync', 'autoSync', e.target.checked)}
                  />
                }
                label="Otomatik Senkronizasyon"
              />

              <TextField
                fullWidth
                label="Güncelleme Aralığı (dakika)"
                type="number"
                value={settings.dataSync.interval}
                onChange={(e) => handleSettingChange('dataSync', 'interval', parseInt(e.target.value))}
                sx={{ mt: 2 }}
                disabled={!settings.dataSync.autoSync}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataSync.retryOnFail}
                    onChange={(e) => handleSettingChange('dataSync', 'retryOnFail', e.target.checked)}
                  />
                }
                label="Hata Durumunda Tekrar Dene"
                disabled={!settings.dataSync.autoSync}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Görünüm Ayarları */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkModeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Görünüm Ayarları</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.darkMode}
                    onChange={(e) => handleSettingChange('display', 'darkMode', e.target.checked)}
                  />
                }
                label="Karanlık Mod"
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dil Seçimi
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={settings.display.language}
                  onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </TextField>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Saat Formatı
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={settings.display.timeFormat}
                  onChange={(e) => handleSettingChange('display', 'timeFormat', e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="24h">24 Saat</option>
                  <option value="12h">12 Saat (AM/PM)</option>
                </TextField>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tarih Formatı
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={settings.display.dateFormat}
                  onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="DD.MM.YYYY">31.12.2024</option>
                  <option value="MM/DD/YYYY">12/31/2024</option>
                  <option value="YYYY-MM-DD">2024-12-31</option>
                </TextField>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sistem Ayarları */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sistem Ayarları</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.cacheEnabled}
                    onChange={(e) => handleSettingChange('system', 'cacheEnabled', e.target.checked)}
                  />
                }
                label="Önbellek Kullan"
              />

              <TextField
                fullWidth
                label="Önbellek Süresi (saat)"
                type="number"
                value={settings.system.cacheDuration}
                onChange={(e) => handleSettingChange('system', 'cacheDuration', parseInt(e.target.value))}
                sx={{ mt: 2 }}
                disabled={!settings.system.cacheEnabled}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.autoCleanup}
                    onChange={(e) => handleSettingChange('system', 'autoCleanup', e.target.checked)}
                  />
                }
                label="Otomatik Temizleme"
                disabled={!settings.system.cacheEnabled}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.debugMode}
                    onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                  />
                }
                label="Hata Ayıklama Modu"
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    // Önbellek temizleme işlemi
                    setAlertMessage('Önbellek başarıyla temizlendi');
                    setAlertSeverity('success');
                    setShowAlert(true);
                  }}
                  disabled={!settings.system.cacheEnabled}
                >
                  Önbelleği Temizle
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box 
        sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          bottom: 16,
          bgcolor: 'background.default',
          zIndex: 1,
          py: 2,
          display: hasUnsavedChanges ? 'flex' : 'none'
        }}
      >
        <Typography color="warning.main">
          * Kaydedilmemiş değişiklikler var
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ minWidth: 200 }}
          color="warning"
        >
          Değişiklikleri Kaydet
        </Button>
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          top: '24px !important',
          zIndex: (theme) => theme.zIndex.drawer + 2
        }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={alertSeverity}
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 