import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Earthquakes from './pages/Earthquakes';
import Cities from './pages/Cities';
import Devices from './pages/Devices';

const App = () => {
    return (
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
                        bgcolor: '#f5f5f5',
                        marginTop: { xs: '64px', sm: '64px', md: 0 }, // AppBar yüksekliği kadar margin
                        position: 'relative'
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/cities" element={<Cities />} />
                            <Route path="/earthquakes" element={<Earthquakes />} />
                            <Route path="/devices" element={<Devices />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/" element={<Dashboard />} />
                        </Routes>
                    </Box>
                </Box>
            </Box>
        </Router>
    );
};

export default App; 