import React, { useEffect, useState } from 'react';
import InputBase from "@mui/material/InputBase";
import styled from "@mui/material/styles/styled";
import Box from '@mui/material/Box';
import Search from "@mui/icons-material/Search";
import SearchResult from './search-box/search-result';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  fontSize: 14,
  width: "100%",
  maxWidth: 350,
  fontWeight: 500,
  padding: "0 1rem",
  borderRadius: "8px",
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%"
  },
  "::placeholder": {
    color: theme.palette.text.disabled
  }
}));

const SearchInput = ({ handleSelect }) => {
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [clicked, setClicked] = useState(false); // when option is clicked

  const handleKeyChange = async (e) => {
    const value = e.target.value;
    setTokenId(value);

    if (value.length > 0) {
      const formData = new FormData();
      formData.append("searchText", value);

      try {
        const response = await fetch('/registry/api/owners/', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setOwnerSuggestions(data.data);
        } else {
          setOwnerSuggestions([]);
          console.error('Failed to send request:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      setOwnerSuggestions([]);
    }
  };

  const handleBlur = (event) => {
    const isOptionClicked =
      (event.relatedTarget && event.relatedTarget.classList.contains('MuiMenuItem-root')) ||
      (event.relatedTarget && event.relatedTarget.classList.contains('MuiCard-root'));

    if (!isOptionClicked) {
      setOwnerSuggestions([]);
      setTokenId('');
    }
  };

  const handleMenuOpen = (isOpen) => {
    if (!isOpen) {
      setOwnerSuggestions([]);
      setProjectSuggestions([]);
      setTokenId('');
    }
  };

  return (
    <Box position="relative">
      <StyledInputBase
        startAdornment={<Search sx={{ fontSize: 19, mr: 1 }} />}
        onChange={handleKeyChange}
        onBlur={handleBlur}
        placeholder='Owner/Project/Token ID'
        sx={{
          mb: 3
        }}
      />
      {(ownerSuggestions.length > 0 || projectSuggestions.length > 0 || tokenId) && (
        <SearchResult
          key="searchresult"
          ownerSuggestions={ownerSuggestions}
          projectSuggestions={projectSuggestions}
          tokenId={tokenId}
          handleSelection={handleSelect}
          handleMenuOpen={handleMenuOpen}
        />
      )}
    </Box>
  );
};

export default SearchInput;