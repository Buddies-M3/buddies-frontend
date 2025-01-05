import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const Verification = ({ criminalRecord }) => {
  if (!criminalRecord) {
    return (
      <Typography variant="h6" color="text.secondary">
        No criminal record data available.
      </Typography>
    );
  }

  return (
    <Box>
      {/* Verification Status */}
      <Card sx={{ mb: 3, bgcolor: '#f0f7f0' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1 }}>
            Verification Status: {criminalRecord.status || "Unknown"}
          </Typography>
          <Typography sx={{ color: '#1b5e20' }}>
            Last checked: {criminalRecord.lastChecked 
              ? new Date(criminalRecord.lastChecked).toLocaleString() 
              : "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* Databases Checked */}
      <Typography variant="h6" gutterBottom>
        Databases Checked
      </Typography>
      <Grid container spacing={2}>
        {criminalRecord.databases?.length > 0 ? (
          criminalRecord.databases.map((db) => (
            <Grid item xs={12} sm={4} key={db}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{db}</Typography>
                  <Typography sx={{ color: '#2e7d32' }}>No Match Found</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="subtitle1" sx={{ color: '#d32f2f' }}>
            No databases were checked.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Verification;
