import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { fetchDashboardStats } from '../services/earthquakeService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (err) {
                setError('İstatistikler yüklenirken bir hata oluştu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
        // Her 5 dakikada bir güncelle
        const interval = setInterval(loadStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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

    if (!stats) return null;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Deprem İzleme Paneli
            </Typography>

            {/* Özet İstatistikler */}
            <Grid container spacing={3} mb={4}>
                {stats.dailyStats && Object.entries(stats.dailyStats).map(([key, value]) => (
                    <Grid item xs={12} md={3} key={key}>
                        <Paper sx={{ 
                            p: 3, 
                            textAlign: 'center', 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 3
                            }
                        }}>
                            <Typography color="textSecondary" gutterBottom>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography variant="h3" component="div" color="primary">
                                {value}
                            </Typography>
                            <Typography variant="subtitle1">{key === 'total_count' ? 'Deprem' : key === 'max_magnitude' ? 'Magnitude' : key === 'avg_magnitude' ? 'Magnitude' : 'km'}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Grafikler */}
            <Grid container spacing={4}>
                {/* Saatlik Deprem Dağılımı */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Saatlik Deprem Dağılımı (Son 24 Saat)
                        </Typography>
                        <Box sx={{ height: '400px', width: '100%' }}>
                            <LineChart
                                width={1200}
                                height={350}
                                data={stats.hourlyStats}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="hour" 
                                    tickFormatter={(value) => new Date(value).toLocaleTimeString('tr-TR', { hour: '2-digit' })}
                                />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip 
                                    labelFormatter={(value) => new Date(value).toLocaleString('tr-TR')}
                                />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8884d8"
                                    name="Deprem Sayısı"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="avg_magnitude"
                                    stroke="#82ca9d"
                                    name="Ortalama Büyüklük"
                                />
                            </LineChart>
                        </Box>
                    </Paper>
                </Grid>

                {/* Magnitude Dağılımı */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Magnitude Dağılımı (Son 7 Gün)
                        </Typography>
                        <Box sx={{ height: '400px', width: '100%' }}>
                            <BarChart
                                width={1200}
                                height={350}
                                data={stats.magnitudeStats}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="magnitude_range" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Deprem Sayısı" />
                            </BarChart>
                        </Box>
                    </Paper>
                </Grid>

                {/* Şehirlere Yakın Depremler */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Şehirlere Yakın Depremler (Son 24 Saat)
                        </Typography>
                        <Box sx={{ 
                            overflowX: 'auto',
                            '& .MuiTable-root': {
                                minWidth: 800,  // minimum genişlik
                            },
                            '& .MuiTableCell-root': {
                                py: 2,  // dikey padding
                                px: 3,  // yatay padding
                            },
                            '& .MuiTableRow-root:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',  // hover efekti
                            }
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Şehir</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Deprem Sayısı</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>En Yakın Deprem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.cityEarthquakes.map((city) => (
                                        <TableRow key={city.city}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                {city.city}
                                            </TableCell>
                                            <TableCell align="right">
                                                {city.earthquake_count}
                                            </TableCell>
                                            <TableCell align="right">
                                                {city.nearest_distance} km
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard; 