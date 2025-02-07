import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { PieChart, Pie, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    // Şehir dağılımı verileri
    const cityData = [
        { name: 'Elazığ', value: 35 },
        { name: 'Malatya', value: 25 },
        { name: 'Bingöl', value: 20 },
        { name: 'Tunceli', value: 20 },
    ];

    // Deprem verileri
    const earthquakeData = [
        { name: '1', value: 2.3 },
        { name: '2', value: 3.1 },
        { name: '3', value: 2.8 },
        { name: '4', value: 4.2 },
        { name: '5', value: 3.7 },
        { name: '6', value: 2.9 },
    ];

    // Yardım çağrıları verileri
    const helpCallsData = [
        { name: 'İlk Yardım', value: 45 },
        { name: 'Arama Kurtarma', value: 65 },
        { name: 'Lojistik Destek', value: 35 },
    ];

    // Sensör alarmları
    const sensorData = [
        { city: 'Elazığ', towns: 8 },
        { city: 'Malatya', towns: 5 },
        { city: 'Bingöl', towns: 7 },
        { city: 'Tunceli', towns: 4 },
    ];

    // Kullanıcı listesi
    const users = [
        { name: 'İrem Özyurt', location: '41.40338, 2.17403', phone: '0000000000' },
        { name: 'Gizem Yüksel', location: '41.40338, 2.17403', phone: '0000000000' },
        { name: 'Burak Güçlü', location: '41.40338, 2.17403', phone: '0000000000' },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                {/* Şehirler Grafiği */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '300px' }}>
                        <Typography variant="h6" gutterBottom>Şehirler</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cityData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {cityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Deprem Verileri Grafiği */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '300px' }}>
                        <Typography variant="h6" gutterBottom>Deprem Verileri</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={earthquakeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Kullanıcılar Tablosu */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '300px', overflow: 'auto' }}>
                        <Typography variant="h6" gutterBottom>Kullanıcılar</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>İsim</TableCell>
                                        <TableCell>Konum</TableCell>
                                        <TableCell>Telefon</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.location}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Yardım Çağrıları Grafiği */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '300px' }}>
                        <Typography variant="h6" gutterBottom>Yardım Çağrıları</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={helpCallsData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {helpCallsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Sensör Alarmları */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '300px' }}>
                        <Typography variant="h6" gutterBottom>Sensör Alarmları</Typography>
                        <TableContainer sx={{ maxHeight: 240 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Şehir</TableCell>
                                        <TableCell align="right">İlçe Sayısı</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sensorData.map((row) => (
                                        <TableRow key={row.city}>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell align="right">{row.towns} ilçe</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 