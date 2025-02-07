import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    TextField,
    IconButton,
    Typography,
    Chip
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const Users = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const users = [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@mail.com', role: 'Admin', status: 'Aktif' },
        { id: 2, name: 'Ayşe Demir', email: 'ayse@mail.com', role: 'Editör', status: 'Aktif' },
        // Daha fazla kullanıcı eklenebilir
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Kullanıcı Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ bgcolor: '#2196f3' }}
                >
                    Yeni Kullanıcı
                </Button>
            </Box>
            
            <TextField
                fullWidth
                margin="normal"
                placeholder="Kullanıcı Ara..."
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ad Soyad</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role}
                                        color={user.role === 'Admin' ? 'primary' : 'secondary'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status}
                                        color={user.status === 'Aktif' ? 'success' : 'error'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={users.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Sayfa başına satır"
                />
            </TableContainer>
        </Box>
    );
};

export default Users; 