import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const RecentSearches = ({ searches, onSearchClick }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  // Format time to display relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <HistoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          Recent Searches
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {searches.map((search, index) => {
          let label;
          let icon;
          
          if (search.type === 'city') {
            label = search.name;
            icon = <LocationCityIcon />;
          } else {
            label = `Lat: ${search.latitude.toFixed(2)}, Lon: ${search.longitude.toFixed(2)}`;
            icon = <LocationOnIcon />;
          }
          
          return (
            <Chip
              key={index}
              icon={icon}
              label={label}
              onClick={() => onSearchClick(search)}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mb: 1 }}
              title={formatRelativeTime(search.timestamp)}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default RecentSearches;
