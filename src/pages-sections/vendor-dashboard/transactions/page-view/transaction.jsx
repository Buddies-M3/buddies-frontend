"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardMedia, Button, Tab, Tabs } from "@mui/material";
import NFCIcon from '@mui/icons-material/Nfc';
import OCRIcon from '@mui/icons-material/TextFields';
import FaceRecognitionIcon from '@mui/icons-material/Face';
import VerificationIcon from '@mui/icons-material/Verified';
import { StatusWrapper } from "pages-sections/vendor-dashboard/styles";
import PassportView from "../passport-view";
import DocumentView from "../document-view";
import FaceMatchView from "../face-match-view";
import Verification from "../Verification";
import format from "date-fns/format";

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`passport-tabpanel-${index}`}
      aria-labelledby={`passport-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PassportPageView = ({ transactionId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [passport, setPassport] = useState(null);
  const [IdImageBase64, setIDImageBase64] = useState(null);
  const [faceRecognition, setFaceRecognition] = useState(null);
  const [criminalRecord, setCriminalRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch passport data
        const passportResponse = await fetch(`/api/transaction/${transactionId}`);
        if (!passportResponse.ok) throw new Error("Failed to fetch passport data");
        const passportData = await passportResponse.json();
        setPassport(passportData);

        console.log(passportData);

        // Fetch ID image
        const imageResponse = await fetch(`/api/id-image/${transactionId}`);
        if (!imageResponse.ok) throw new Error("Failed to fetch passport image");
        const imageData = await imageResponse.json();
        if (imageData?.base64Image) {
          setIDImageBase64(imageData.base64Image);
        }

        // Use real face recognition data from API
        if (passportData.faceRecognition) {
          setFaceRecognition(passportData.faceRecognition);
        }

        // Dummy criminal records check
        setCriminalRecord({
          status: "CLEAR",
          lastChecked: new Date().toISOString(),
          databases: ["INTERPOL", "LOCAL_POLICE", "IMMIGRATION"],
          matches: []
        });
      } catch (error) {
        setError(error.message);
      }
    };

    if (transactionId) fetchData();
  }, [transactionId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getImageSrc = (base64String) => {
    if (!base64String) return null;
    return base64String.startsWith('data:')
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!passport) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading passport information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => window.history.back()}
      >
        Back to Transactions
      </Button>

      {/* Transaction Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Transaction Details
          </Typography>
          <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="body1">
                {passport.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Time
              </Typography>
              <Typography variant="body1">
                {passport.time ? format(new Date(passport.time), 'dd-MMM-yyyy hh:mm a') : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <StatusWrapper status={passport.status}>
                {passport.status}
              </StatusWrapper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab icon={<NFCIcon />} label="NFC" />
              <Tab icon={<OCRIcon />} label="OCR" />
              <Tab icon={<FaceRecognitionIcon />} label="Face Recognition" />
              <Tab icon={<VerificationIcon />} label="Verification" />
            </Tabs>
          </Box>

          {/* Tab 1: Passport Information */}
          <TabPanel value={activeTab} index={0}>
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
                  {passport?.faceImageBase64 ? (
                    <CardMedia
                      component="img"
                      alt="Passport Photo"
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: "contain"
                      }}
                      image={passport.faceImageBase64}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Loading photo...
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <PassportView passport={passport} />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Document View */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>

                <DocumentView document={passport} />
              </Grid>
              <Grid item xs={12} md={6}>
                {IdImageBase64 && (
                  <Box sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: '#f5f5f5'
                  }}>
                    <CardMedia
                      component="img"
                      alt="Passport Document"
                      sx={{
                        height: 500,
                        objectFit: "contain"
                      }}
                      image={getImageSrc(IdImageBase64)}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Face Recognition */}
          <TabPanel value={activeTab} index={2}>
            {faceRecognition && (
              <FaceMatchView passport={passport} faceRecognition={faceRecognition} />
            )}
          </TabPanel>

          {/* Tab 4: Verification */}
          <TabPanel value={activeTab} index={3}>
            {criminalRecord && (
              <Verification criminalRecord={criminalRecord} />
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PassportPageView;