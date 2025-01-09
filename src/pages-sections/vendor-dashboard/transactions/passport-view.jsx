import React from 'react';
import { Grid, Box, Typography, Avatar } from '@mui/material';

const PassportView = ({ passport }) => {
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
          <Typography variant="h6">{passport.expiryDate || 'N/A'}</Typography>
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
