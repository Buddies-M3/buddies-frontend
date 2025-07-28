import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { Link } from "@mui/material";

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
    <StyledTableCell align="left">{expiry}</StyledTableCell>
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