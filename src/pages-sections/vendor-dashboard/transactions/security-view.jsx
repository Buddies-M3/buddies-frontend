import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const SecurityView = ({ passport }) => {
  console.log('SecurityView - Full passport object:', passport);
  
  const { sod } = passport || {};
  
  console.log('SecurityView - Extracted values:', { sod });

  if (!sod) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No security information available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Debug: Available passport keys: {passport ? Object.keys(passport).join(', ') : 'None'}
        </Typography>
        {passport && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Raw passport: {JSON.stringify(passport, null, 2)}
          </Typography>
        )}
      </Box>
    );
  }

  const getSecurityStatus = (passiveAuth) => {
    return passiveAuth ? 'VERIFIED' : 'UNVERIFIED';
  };

  const getSecurityColor = (passiveAuth) => {
    return passiveAuth ? 'success' : 'error';
  };

  const formatHash = (hash) => {
    if (!hash) return 'N/A';
    return hash.match(/.{1,8}/g)?.join(' ') || hash;
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        {/* Security Overview Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Security Overview</Typography>
              </Box>
              
              <Grid container spacing={2}>
                {sod && sod.signingcertificate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Passive Authentication
                    </Typography>
                    <Chip
                      icon={<VerifiedIcon />}
                      label={getSecurityStatus(sod.signingcertificate.passiveauth)}
                      color={getSecurityColor(sod.signingcertificate.passiveauth)}
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                )}
                
                {sod && sod.digestalgorithm && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Digest Algorithm
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {sod.digestalgorithm}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Certificate Information Card */}
        {sod && sod.signingcertificate && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FingerprintIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Digital Certificate</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Subject
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                      {sod.signingcertificate.subject || 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Issuer
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                      {sod.signingcertificate.issuer || 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Serial Number
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                      {sod.signingcertificate.serialnumber || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Data Group Hashes Card */}
        {sod && sod.datagrouphashes && Object.keys(sod.datagrouphashes).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Data Group Hash Verification
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Cryptographic hashes of passport data groups used for integrity verification
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Data Group</strong></TableCell>
                        <TableCell><strong>Hash Value</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(sod.datagrouphashes).map(([group, hash]) => (
                        <TableRow key={group}>
                          <TableCell>
                            <Chip
                              label={group.toUpperCase()}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {formatHash(hash)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SecurityView;