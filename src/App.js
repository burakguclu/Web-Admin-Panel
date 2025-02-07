import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getThemeMode } from './services/settingsService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Earthquakes from './pages/Earthquakes';
import Cities from './pages/Cities';
import Devices from './pages/Devices';
import Settings from './pages/Settings';

const App = () => {
    const [mode, setMode] = useState(getThemeMode());

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'dark' ? {
                        background: {
                            default: '#121212',
                            paper: '#1e1e1e',
                        },
                        primary: {
                            main: '#90caf9',
                        },
                        text: {
                            primary: '#ffffff',
                            secondary: 'rgba(255, 255, 255, 0.7)',
                        },
                    } : {
                        background: {
                            default: '#f5f5f5',
                            paper: '#ffffff',
                        },
                        primary: {
                            main: '#1976d2',
                        },
                        text: {
                            primary: 'rgba(0, 0, 0, 0.87)',
                            secondary: 'rgba(0, 0, 0, 0.6)',
                        },
                    }),
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                            },
                        },
                    },
                },
            }),
        [mode],
    );

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Sidebar />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            minHeight: '100vh',
                            width: '100%',
                            bgcolor: 'background.default',
                            marginTop: { xs: '64px', sm: '64px', md: 0 }, // AppBar yüksekliği kadar margin
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/earthquakes" element={<Earthquakes />} />
                                <Route path="/cities" element={<Cities />} />
                                <Route path="/devices" element={<Devices />} />
                                <Route path="/settings" element={<Settings setMode={setMode} />} />
                                <Route path="/" element={<Dashboard />} />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default App; 