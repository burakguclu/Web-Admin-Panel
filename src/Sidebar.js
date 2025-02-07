import { useTheme } from '@mui/material/styles';

const Sidebar = () => {
  const theme = useTheme();
  
  // ... diğer kodlar ...

  return (
    <Box
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, #1e1e1e 30%, #2c2c2c 90%)'
          : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        // ... diğer stiller
      }}
    >
      {/* ... diğer içerikler ... */}
    </Box>
  );
}; 