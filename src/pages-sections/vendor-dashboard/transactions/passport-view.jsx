import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

const PassportView = ({ passport }) => {
  if (!passport) {
    return (
      <Typography variant="h6" color="text.secondary">
        Passport information is not available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Passport Number
          </Typography>
          <Typography variant="h6">
            {passport.idNumber || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Full Name
          </Typography>
          <Typography variant="h6">
            {passport.fullName || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Date of Birth
          </Typography>
          <Typography variant="h6">
            {passport.birthdate || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Occupation
          </Typography>
          <Typography variant="h6">
            {passport.occupation || 'N/A'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Nationality
          </Typography>
          <Typography variant="h6">
            {passport.nationality || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Expiry Date
          </Typography>
          <Typography variant="h6">
            {passport.expiryDate || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Address
          </Typography>
          <Typography variant="h6">
            {passport.address || 'N/A'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PassportView;

