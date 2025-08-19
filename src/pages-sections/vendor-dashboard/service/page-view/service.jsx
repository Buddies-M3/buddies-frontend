"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const ServicePageView = () => {
  const [sessionId, setSessionId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [passportData, setPassportData] = useState(null);
  const [isWaitingForVerification, setIsWaitingForVerification] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (sessionId && isWaitingForVerification) {
      // Use fast polling for real-time updates
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/service/verification/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.verified && data.passportData) {
              setPassportData(data.passportData);
              setIsWaitingForVerification(false);
              setQrCodeUrl(null);
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error polling for verification:', error);
        }
      }, 500); // Poll every 500ms for real-time feel

      // Stop polling after 10 minutes
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsWaitingForVerification(false);
      }, 600000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [sessionId, isWaitingForVerification]);

  const startNewService = async () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setIsWaitingForVerification(true);
    setPassportData(null);

    try {
      const qrData = JSON.stringify({
        sessionId: newSessionId,
        type: 'sudapass_verification',
        timestamp: Date.now(),
        service: 'SUDAPASS'
      });
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 280,
        margin: 2,
        color: {
          dark: theme.palette.primary.main,
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const resetService = () => {
    setSessionId(null);
    setQrCodeUrl(null);
    setPassportData(null);
    setIsWaitingForVerification(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>

      <Grid container spacing={4}>
        {!sessionId ? (
          /* Start Service Card */
          <Grid item xs={12} md={8} mx="auto">
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <QrCodeScannerIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  SUDAPASS Verification
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  Verify your service users with SUDAPASS
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={startNewService}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  Start New Service
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : !passportData ? (
          /* QR Code Display */
          <Grid item xs={12} md={6} mx="auto">
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Scan QR Code
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use SUDAPASS mobile app to scan this code
                  </Typography>
                </Box>

                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="SUDAPASS QR Code" 
                      style={{ 
                        borderRadius: '8px',
                        border: `2px solid ${theme.palette.primary.main}20`
                      }} 
                    />
                  )}
                </Paper>

                <Chip 
                  label={`Session: ${sessionId.slice(0, 8)}...`}
                  variant="outlined"
                  sx={{ mb: 2, fontFamily: 'monospace' }}
                />

                {isWaitingForVerification && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="primary">
                      Waiting for mobile app verification...
                    </Typography>
                  </Box>
                )}

                <Button 
                  variant="outlined" 
                  onClick={resetService}
                  sx={{ mt: 2 }}
                >
                  Cancel Session
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          /* Passport Data Display - Matching NFC Tab Design */
          <Grid item xs={12}>
            <Card>
              {/* Verified Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                color: 'white',
                p: 3,
                textAlign: 'center'
              }}>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Verification Successful
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  User has been successfully verified
                </Typography>
              </Box>

              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{
                      position: 'relative',
                      height: 300,
                      overflow: 'hidden',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: '#f5f5f5'
                    }}>
                      {passportData?.photoUrl ? (
                        <CardMedia
                          component="img"
                          alt="Passport Photo"
                          sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: "contain"
                          }}
                          image={passportData.photoUrl}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No photo available
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    {/* Using the same passport display structure as NFC tab */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Passport Number
                          </Typography>
                          <Typography variant="h6">{passportData.passportNumber || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography variant="h6">{passportData.fullName || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date of Birth
                          </Typography>
                          <Typography variant="h6">{passportData.dateOfBirth || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Gender
                          </Typography>
                          <Typography variant="h6">{passportData.gender || 'N/A'}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Nationality
                          </Typography>
                          <Typography variant="h6">{passportData.nationality || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Expiry Date
                          </Typography>
                          <Typography variant="h6">{passportData.expiryDate || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Issue Date
                          </Typography>
                          <Typography variant="h6">{passportData.issueDate || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Issuing Country
                          </Typography>
                          <Typography variant="h6">{passportData.issuingCountry || 'N/A'}</Typography>
                        </Box>
                        {passportData.personalNumber && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Personal Number
                            </Typography>
                            <Typography variant="h6">{passportData.personalNumber}</Typography>
                          </Box>
                        )}
                        {passportData.placeOfBirth && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Place of Birth
                            </Typography>
                            <Typography variant="h6">{passportData.placeOfBirth}</Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={resetService}
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Reset
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ServicePageView;