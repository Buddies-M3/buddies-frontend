import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { Link, Alert, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

// MUI ICON COMPONENTS

import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";

// GLOBAL CUSTOM COMPONENTS

import { FlexBox } from "components/flex-box";
import BazaarSwitch from "components/BazaarSwitch";
import { Paragraph, Small } from "components/Typography";

import format from "date-fns/format";

// CUSTOM UTILS LIBRARY FUNCTION

import api from 'utils/__api__/systems';

import { currency, kWh, countryCodeToFlag } from "lib";

// STYLED COMPONENTS

import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton, StatusWrapper } from "../styles";

// ========================================================================
import ConnectionIndicator from "components/system/connection-indicator";

// ========================================================================
const TransactionRow = ({
  transaction,
  handleDelete
}) => {
  const {
    id,
    time,
    owner,
    number,
    expiry,
    nationality,
    status,
  } = transaction || {};
  
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

  const router = useRouter();

  //const [systemConnected, setSystemPublish] = useState(connected);
  return <StyledTableRow tabIndex={-1} role="checkbox">
    <StyledTableCell align="left">
      <Link href={`/dashboard/transaction/${id}`} passHref>
        <a style={{ textDecoration: 'none', color: 'black'}}>{id}</a>
      </Link>
    </StyledTableCell>
    <StyledTableCell align="left">{time ? format(new Date(time), 'dd-MMM-yyyy hh:mm a') : "N/A"}</StyledTableCell>
    <StyledTableCell align="left">{owner}</StyledTableCell>
    <StyledTableCell align="left">{number}</StyledTableCell>
    <StyledTableCell align="left">
      {isDocumentExpired(expiry) ? (
        <Box
          sx={{ 
            color: '#ff9800',
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            padding: '3px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.3,
            whiteSpace: 'nowrap',
            minWidth: 'fit-content'
          }}
        >
          <WarningIcon sx={{ fontSize: 12 }} />
          {expiry}
        </Box>
      ) : (
        expiry
      )}
    </StyledTableCell>
    <StyledTableCell align="left">{nationality}</StyledTableCell>
    <StyledTableCell align="left"><StatusWrapper status={status}>{status}</StatusWrapper></StyledTableCell>
    <StyledTableCell align="center">
      <StyledIconButton onClick={() => handleDelete(id)}>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
  
};

export default TransactionRow;