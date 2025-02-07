import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Divider,
    Box,
    Typography,
    IconButton,
    useMediaQuery,
    AppBar,
    Toolbar
} from '@mui/material';
import { 
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    LocationCity as CitiesIcon,
    Warning as EarthquakesIcon,
    DeviceHub as DevicesIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Depremler', icon: <EarthquakesIcon />, path: '/earthquakes' },
        { text: 'Şehirler', icon: <CitiesIcon />, path: '/cities' },
        { text: 'Cihazlar', icon: <DevicesIcon />, path: '/devices' },
        { text: 'Ayarlar', icon: <SettingsIcon />, path: '/settings' }
    ];

    const drawerContent = (
        <>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #1e1e1e 30%, #2c2c2c 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#fff'
                }}
            >
                <img 
                    src="/logo192.png" 
                    alt="Logo" 
                    style={{ 
                        width: '40px', 
                        height: '40px',
                        borderRadius: '8px'
                    }} 
                />
                <Typography 
                    variant="h6" 
                    component="div"
                    sx={{ 
                        flexGrow: 1,
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}
                >
                    Admin Panel
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </Box>
            <Divider />
            <List sx={{ pt: 1 }}>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            if (isMobile) handleDrawerToggle();
                        }}
                        selected={location.pathname === item.path}
                        sx={{
                            mx: 1,
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(144, 202, 249, 0.2)' 
                                    : 'primary.main',
                                color: theme.palette.mode === 'dark' 
                                    ? '#90caf9' 
                                    : 'white',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(144, 202, 249, 0.3)'
                                        : 'primary.dark',
                                },
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.mode === 'dark' 
                                        ? '#90caf9' 
                                        : 'white',
                                },
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(144, 202, 249, 0.08)'
                                    : 'rgba(25, 118, 210, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: location.pathname === item.path 
                                    ? (theme.palette.mode === 'dark' ? '#90caf9' : 'white')
                                    : (theme.palette.mode === 'dark' ? '#fff' : 'primary.main'),
                                minWidth: '40px'
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <>
            {isMobile && (
                <AppBar 
                    position="fixed" 
                    sx={{ 
                        display: { md: 'none' },
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #1e1e1e 30%, #2c2c2c 90%)'
                            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                            <img 
                                src="/logo192.png" 
                                alt="Logo" 
                                style={{ 
                                    width: '32px', 
                                    height: '32px',
                                    borderRadius: '6px'
                                }} 
                            />
                            <Typography variant="h6">Admin Panel</Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}
            
            <Box 
                component="nav"
                sx={{
                    width: { md: 240 },
                    flexShrink: { md: 0 }
                }}
            >
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                width: 240,
                                boxSizing: 'border-box',
                                boxShadow: 3,
                                bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
                                marginTop: '64px'
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': {
                                width: 240,
                                boxSizing: 'border-box',
                                boxShadow: 3,
                                bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
                                border: 'none'
                            },
                        }}
                        open
                    >
                        {drawerContent}
                    </Drawer>
                )}
            </Box>
        </>
    );
};

export default Sidebar; 