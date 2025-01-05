import React, { useEffect, useState } from 'react';
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem"; // STYLED COMPONENT
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";


import { SearchResultCard } from "./styled";


// ==============================================================

const SearchResult = ({ ownerSuggestions, projectSuggestions, tokenId, handleSelection, handleMenuOpen }) => {
  console.log("Rendering SearchResult with props:", { ownerSuggestions, projectSuggestions, tokenId });
  const [owners, setOwners] = useState([]);
  const [projects, setProjects] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setOwners(ownerSuggestions);
    setProjects(projectSuggestions);
    setToken(tokenId);
  },[ownerSuggestions, projectSuggestions, tokenId]);

  return (
    <SearchResultCard elevation={2}>
      {/* Suggestions */}
      {owners.map((owner) => (
        <MenuItem key={owner.chainAddress}
          onClick={() => {
            handleSelection({ type: 'owner', data: owner });
            handleMenuOpen(false);
          }}
        >
          <SearchIcon style={{ fontSize: 18, marginRight: '8px', color: 'rgba(0, 0, 0, 0.12)' }} />
          {owner.fname}&nbsp;
          <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>{` (${owner.chainaddress})`}</span>
        </MenuItem>
      ))}

      {/* Separator with spaces on start and end */}
      {owners.length > 0 && token && (
        <Box mt={2} mb={2} maxWidth="90vh">
          <Divider />
        </Box>
      )}

      {token && (<MenuItem
        key="token"
        onClick={() => {
          handleSelection({ type: 'id', data: token });
          handleMenuOpen(false);
        }}
      >
        <TrendingUpIcon style={{ fontSize: 18, marginRight: '8px', color: 'rgba(0, 0, 0, 0.12)' }} />
        {"Token ID:"}&nbsp;
        <span style={{ color: 'rgba(0, 0, 0, 0.38)' }}>{token}</span>
      </MenuItem>)}

      {/* Trends */}
      {/* {trends.map((trend) => (
      <MenuItem key="tokenId" onClick={() => handleSelection(tokenId)}>
        <TrendingUpIcon style={{ fontSize: 18, marginRight: '8px', color: 'rgba(0, 0, 0, 0.12)' }} /> {`Token ID: ${tokenId}`}
      </MenuItem>
    ))} */}
    </SearchResultCard>
  );
}

export default SearchResult;