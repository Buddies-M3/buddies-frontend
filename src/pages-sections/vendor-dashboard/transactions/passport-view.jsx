import React from 'react';
import { Grid, Box, Typography, Avatar, Alert } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const PassportView = ({ passport }) => {
  // Helper function to check if document is expired
  const isDocumentExpired = (expiryDateStr) => {
    if (!expiryDateStr || expiryDateStr === 'N/A') return false;
    
    try {
      // Parse the formatted date (dd-MMM-yyyy)
      const [day, month, year] = expiryDateStr.split('-');
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const expiryDate = new Date(parseInt(year), monthMap[month], parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      
      return expiryDate < today;
    } catch (error) {
      console.warn('Error parsing expiry date:', error);
      return false;
    }
  };

  if (!passport) {
    return (
      <Typography variant="h6" color="text.secondary">
        Passport information is not available.
      </Typography>
    );
  }

  // Decode Base64 image if provided
  const faceImageSrc = passport.faceImageBase64
    ? `data:image/jpeg;base64,${passport.faceImageBase64}`
    : null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Passport Number
          </Typography>
          <Typography variant="h6">{passport.idNumber || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Full Name
          </Typography>
          <Typography variant="h6">{passport.fullName || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Date of Birth
          </Typography>
          <Typography variant="h6">{passport.birthdate || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Birthplace
          </Typography>
          <Typography variant="h6">{passport.birthplace || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Occupation
          </Typography>
          <Typography variant="h6">{passport.occupation || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Gender
          </Typography>
          <Typography variant="h6">{passport.gender || 'N/A'}</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Nationality
          </Typography>
          <Typography variant="h6">{passport.nationality || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Expiry Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{passport.expiryDate || 'N/A'}</Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Issuance Date
          </Typography>
          <Typography variant="h6">{passport.issuanceDate || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Issuance State
          </Typography>
          <Typography variant="h6">{passport.issuanceState || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Issuing Authority
          </Typography>
          <Typography variant="h6">{passport.issuingAuthority || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Address
          </Typography>
          <Typography variant="h6">{passport.address || 'N/A'}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PassportView;
