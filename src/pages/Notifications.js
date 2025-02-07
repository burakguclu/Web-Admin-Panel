import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Notifications() {
  const [expanded, setExpanded] = useState(false);

  const cityNotifications = {
    'İstanbul': [
      {
        id: 1,
        title: 'Yeni Sipariş',
        description: 'Kadıköy şubesinden yeni sipariş #1234',
        time: '5 dakika önce'
      },
      {
        id: 2,
        title: 'Sistem Güncellemesi',
        description: 'Beşiktaş şubesi sistem güncellemesi tamamlandı',
        time: '1 saat önce'
      }
    ],
    'Ankara': [
      {
        id: 3,
        title: 'Yeni Kullanıcı',
        description: 'Çankaya şubesine yeni kullanıcı kaydı',
        time: '2 saat önce'
      },
      {
        id: 4,
        title: 'Stok Uyarısı',
        description: 'Kızılay şubesi stok seviyesi düşük',
        time: '3 saat önce'
      }
    ],
    'İzmir': [
      {
        id: 5,
        title: 'Bakım Bildirimi',
        description: 'Karşıyaka şubesi bakım çalışması',
        time: '1 gün önce'
      }
    ]
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Şehirlere Göre Bildirimler
      </Typography>
      
      {Object.entries(cityNotifications).map(([city, notifications]) => (
        <Accordion 
          key={city}
          expanded={expanded === city}
          onChange={handleChange(city)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'background.paper' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="h6">{city}</Typography>
              <Badge 
                badgeContent={notifications.length} 
                color="primary"
                sx={{ mr: 4 }}
              >
                <NotificationsIcon />
              </Badge>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id} 
                  sx={{ 
                    bgcolor: 'background.paper', 
                    mb: 1, 
                    borderRadius: 1,
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        {notification.description}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default Notifications; 