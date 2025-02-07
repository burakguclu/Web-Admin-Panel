import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    TextField,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const Products = () => {
    const [category, setCategory] = useState('all');

    const products = [
        {
            id: 1,
            name: 'Ürün 1',
            price: '199.99 ₺',
            category: 'Elektronik',
            stock: 45,
            image: 'https://via.placeholder.com/150'
        },
        // Daha fazla ürün eklenebilir
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Ürün Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ bgcolor: '#2196f3' }}
                >
                    Yeni Ürün
                </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Ürün Ara..."
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Kategori</InputLabel>
                        <Select
                            value={category}
                            label="Kategori"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="all">Tümü</MenuItem>
                            <MenuItem value="electronics">Elektronik</MenuItem>
                            <MenuItem value="clothing">Giyim</MenuItem>
                            <MenuItem value="books">Kitaplar</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Fiyat: {product.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Stok: {product.stock}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Kategori: {product.category}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error">
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Products; 