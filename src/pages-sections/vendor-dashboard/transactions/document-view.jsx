import React from 'react';
import { Box, Typography } from '@mui/material';

const DocumentView = ({ document }) => {
  if (!document) {
    return (
      <Typography variant="h6" color="text.secondary">
        Document information is not available.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Passport Number
        </Typography>
        <Typography variant="h6">{document.idNumber || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Full Name
        </Typography>
        <Typography variant="h6">{document.fullName || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Date of Birth
        </Typography>
        <Typography variant="h6">{document.birthdate || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Birthplace
        </Typography>
        <Typography variant="h6">{document.birthplace || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Nationality
        </Typography>
        <Typography variant="h6">{document.nationality || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Occupation
        </Typography>
        <Typography variant="h6">{document.occupation || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Expiry Date
        </Typography>
        <Typography variant="h6">{document.expiryDate || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Issuance Date
        </Typography>
        <Typography variant="h6">{document.issuanceDate || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Issuance State
        </Typography>
        <Typography variant="h6">{document.issuanceState || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Issuing Authority
        </Typography>
        <Typography variant="h6">{document.issuingAuthority || 'N/A'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Address
        </Typography>
        <Typography variant="h6">{document.address || 'N/A'}</Typography>
      </Box>
    </Box>
  );
};

export default DocumentView;