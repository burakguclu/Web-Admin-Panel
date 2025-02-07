import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Reports = () => {
    const salesData = [
        { name: 'Oca', value: 4000 },
        { name: 'Şub', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Nis', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Haz', value: 2390 },
    ];

    const categoryData = [
        { name: 'Elektronik', value: 400 },
        { name: 'Giyim', value: 300 },
        { name: 'Kitap', value: 300 },
        { name: 'Spor', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Raporlar</Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Aylık Satış Grafiği
                        </Typography>
                        <BarChart
                            width={500}
                            height={300}
                            data={salesData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Kategori Dağılımı
                        </Typography>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={categoryData}
                                cx={200}
                                cy={150}
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports; 