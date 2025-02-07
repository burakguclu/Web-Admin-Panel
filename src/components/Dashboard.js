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

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    useEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

function Dashboard() {
    const [width] = useWindowSize();
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

    // İstatistik kartları için başlık düzenlemeleri
    const statTitles = {
        total_count: 'Toplam Deprem',
        max_magnitude: 'En Büyük Deprem',
        significant_count: 'Önemli Depremler (≥4.0)',
        avg_depth: 'Ortalama Derinlik'
    };

    // Gösterilecek istatistiklerin sırası
    const displayOrder = ['total_count', 'max_magnitude', 'significant_count', 'avg_depth'];

    // Grafik genişliğini hesapla (sidebar genişliğini de hesaba katarak)
    const chartWidth = Math.min(width - 300, 1000); // 300px sidebar için, 1000px maksimum genişlik

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}> {/* Ana container'ı sınırla */}
            <Typography variant="h4" gutterBottom>
                Afet İzleme Paneli
            </Typography>

            {/* Özet İstatistikler */}
            <Grid container spacing={3} mb={4}>
                {stats.dailyStats && displayOrder.map((key) => (
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
                            },
                            bgcolor: key === 'max_magnitude' ? 'error.light' : 
                                    key === 'significant_count' ? 'warning.light' : 
                                    key === 'avg_depth' ? 'info.light' : 'primary.light',
                        }}>
                            <Typography color="textSecondary" gutterBottom>
                                {statTitles[key]}
                            </Typography>
                            <Typography variant="h3" component="div" 
                                sx={{ 
                                    color: key === 'max_magnitude' ? 'error.dark' : 
                                           key === 'significant_count' ? 'warning.dark' : 
                                           key === 'avg_depth' ? 'info.dark' : 'primary.dark'
                                }}>
                                {typeof stats.dailyStats[key] === 'number' ? 
                                    stats.dailyStats[key].toFixed(1) : 
                                    stats.dailyStats[key]}
                            </Typography>
                            <Typography variant="subtitle1">
                                {key.includes('magnitude') ? 'Magnitude' : 
                                 key.includes('depth') ? 'km' : 
                                 key.includes('count') ? 'Adet' : ''}
                            </Typography>
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
                            Son 24 Saatteki Deprem Aktivitesi
                        </Typography>
                        <Box sx={{ 
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <LineChart
                                width={chartWidth}
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
                                    name="Deprem Sayısı (Adet)"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="avg_magnitude"
                                    stroke="#82ca9d"
                                    name="Ortalama Büyüklük (M)"
                                />
                            </LineChart>
                        </Box>
                    </Paper>
                </Grid>

                {/* Magnitude Dağılımı */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Haftalık Deprem Büyüklük Dağılımı
                        </Typography>
                        <Box sx={{ 
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <BarChart
                                width={chartWidth}
                                height={350}
                                data={stats.magnitudeStats}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="magnitude_range" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar 
                                    dataKey="count" 
                                    fill="#8884d8" 
                                    name="Deprem Sayısı (Adet)" 
                                />
                            </BarChart>
                        </Box>
                    </Paper>
                </Grid>

                {/* Şehirlere Yakın Depremler */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Şehirlerdeki Deprem Aktivitesi (Son 24 Saat)
                        </Typography>
                        <Box sx={{ 
                            width: '100%',
                            '& .MuiTable-root': {
                                width: '100%',
                                maxWidth: chartWidth,
                                mx: 'auto'
                            }
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Şehir</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Deprem Sayısı (24s)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>En Yakın Deprem Mesafesi</TableCell>
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