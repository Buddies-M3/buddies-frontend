import React from 'react';
import { Grid, Box, Typography, CardMedia } from '@mui/material';

const FaceMatchView = ({ faceRecognition, passport }) => {
  // Helper function for image source
  const getImageSrc = (base64Image) => `data:image/jpeg;base64,${base64Image}`;

  if (!faceRecognition) {
    return (
      <Typography variant="h6" color="text.secondary">
        Face recognition data is not available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Face Match Results */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Face Match Results
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Confidence Score
          </Typography>
          <Typography variant="h6">
            {(faceRecognition.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Match Status
          </Typography>
          <Typography variant="h6">
            {faceRecognition.matchStatus || "Unknown"}
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Liveness Detection
          </Typography>
          <Typography variant="h6">
            {faceRecognition.liveness?.status || "Unknown"} ({(faceRecognition.liveness?.score * 100).toFixed(1)}%)
          </Typography>
        </Box>
      </Grid>

      {/* Photos */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          {passport?.faceImageBase64 && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Passport Photo
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt="Passport Photo"
                    sx={{
                      height: 200,
                      objectFit: "contain",
                    }}
                    image={`${passport.faceImageBase64}`}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Live Photo
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt="Live Photo"
                    sx={{
                      height: 200,
                      objectFit: "contain",
                    }}
                    image={`${passport.faceImageBase64}`}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FaceMatchView;
