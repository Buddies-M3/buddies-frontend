import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";

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

import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";

// ========================================================================
import ConnectionIndicator from "components/system/connection-indicator";

// ========================================================================
const SystemRow = ({
  system,
  handleRowDelete
}) => {
  const {
    name,
    created_at,
    api_key,
    expiry,
    id,
  } = system || {};
  

  const router = useRouter();

  //const [systemConnected, setSystemPublish] = useState(connected);
  return <StyledTableRow tabIndex={-1} role="checkbox">
    <StyledTableCell align="left">
      {name}
    </StyledTableCell>

    <StyledTableCell align="left">
      {api_key}
    </StyledTableCell>

    <StyledTableCell align="left"><CategoryWrapper>{created_at ? format(new Date(created_at), 'dd-MMM-yyyy') : "N/A"}</CategoryWrapper></StyledTableCell>
    <StyledTableCell align="left"><CategoryWrapper>{expiry ? format(new Date(expiry), 'dd-MMM-yyyy') : "Never"}</CategoryWrapper></StyledTableCell>
  
    <StyledTableCell align="center">
      <StyledIconButton onClick={() => handleRowDelete(id)}>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
};

export default SystemRow;