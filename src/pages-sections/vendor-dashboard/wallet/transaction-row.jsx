import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import Web3 from 'web3';
import { format } from 'date-fns';


// MUI ICON COMPONENTS
import ReceiveIcon from '@mui/icons-material/FileDownload';
import SendIcon from '@mui/icons-material/FileUpload';
import NewIcon from '@mui/icons-material/AddBox';
import Checkbox from "@mui/material/Checkbox";

import styled from "@mui/material/styles/styled";


import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";

// GLOBAL CUSTOM COMPONENTS

import { FlexBox } from "components/flex-box";
import BazaarSwitch from "components/BazaarSwitch";
import { Paragraph, Small } from "components/Typography";


const StatusWrapper = styled(FlexBox)(({ theme, payment }) => ({
  borderRadius: "8px",
  padding: "3px 12px",
  display: "inline-flex",
  color: payment ? theme.palette.error.main : theme.palette.success.main,
  backgroundColor: payment ? theme.palette.error[100] : theme.palette.success[100]
}));

// CUSTOM UTILS LIBRARY FUNCTION

import api from 'utils/__api__/systems';

import { currency, kWh, countryCodeToFlag } from "lib";

// STYLED COMPONENTS

import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";

// ========================================================================
import ConnectionIndicator from "components/system/connection-indicator";
import { parseTokenBalance } from "utils/misc-utils";

// ========================================================================
const ALCHEMY_URL = `${process.env.NEXT_PUBLIC_ALCHEMY_URL}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const TransactionRow = ({
  tx,
  onSelectRow,
  hideSelectBtn = false,
  checked = false
}) => {
  const {
    tokenId,
    projectType,
    amount,
    projectName,
    startDate,
    endDate,
    status,
    projectIpfsHash
  } = tx || {};

  const router = useRouter();

  const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_URL));

  const renderTransactionTypeIcon = (category) => {
    console.log(`Category: ${category}`);
    switch (category) {
      case 'mint':
        return <NewIcon sx={{ color: 'primary.main' }} />; // New
      case 'receive':
        return <ReceiveIcon sx={{ color: 'red' }} />; // Transfer
      default:
        return <SendIcon sx={{ color: 'green' }} />; // Receive
      
    }
  };

  const renderTransactionAge = (timestamp) => {
    const now = new Date();
    const transactionDate = new Date(timestamp * 1000);
    const diffInSeconds = Math.floor((now - transactionDate) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${diffInSeconds} seconds ago`;
    }
  };

  //const [systemConnected, setSystemPublish] = useState(connected);
  return <StyledTableRow tabIndex={-1} role="checkbox">
    {!hideSelectBtn && <StyledTableCell><Checkbox color="info" checked={checked} onChange={event => onSelectRow(tokenId)}/></StyledTableCell>}
    <StyledTableCell align="left"><Link href={`/registry/gcn/${tokenId}`}>{`#${tokenId}`}</Link></StyledTableCell>
    <StyledTableCell align="left">{parseTokenBalance(amount)}</StyledTableCell>
    {projectIpfsHash ? 
    <StyledTableCell align="left"><Link href={`/registry/project/${projectIpfsHash}`}>{projectName}</Link></StyledTableCell>
    :
    <StyledTableCell align="left">{projectName}</StyledTableCell>}
    <StyledTableCell align="center">
      <CategoryWrapper>{format(new Date(startDate * 1000), 'dd-MMM-yy')}</CategoryWrapper>
      {" to "}
      <CategoryWrapper>{format(new Date(endDate * 1000), 'dd-MMM-yy')}</CategoryWrapper>
    </StyledTableCell>
    <StyledTableCell align="center">
      {status == 1 ? <StatusWrapper payment={true}>{"Retired"}</StatusWrapper> : <StatusWrapper payment={false}>{"Active"}</StatusWrapper>}
    </StyledTableCell>

  </StyledTableRow>;
};

export default TransactionRow;