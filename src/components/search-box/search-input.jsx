import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useSearch from "./use-search";
import SearchResult from "./search-result";
import { SearchOutlinedIcon } from "./styled";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import axios from "axios";

import api from "utils/__api__/products";


// A function to convert a file to a base64-encoded string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const SearchInput = () => {
  const {
    handleSearch,
    handleChange,
    parentRef,
    resultList
  } = useSearch();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleKeyChange = async (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      if (typeof searchText === 'string' && searchText.trim() !== '') {
        router.push(`/products/search/${encodeURIComponent(searchText)}`);
      }

    }
  };

  const handleFileUpload = async (event) => {
    try {
      const selectedFile = event.target.files[0];

      const products = await api.searchByImage(selectedFile);
      const query = encodeURIComponent(JSON.stringify(products));
      
      router.push('/products/image/', undefined, { shallow: true, state: { data: products } });

      console.log('Router navigation successful'); // Check if this message is logged
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };


  const INPUT_PROPS = {
    sx: {
      height: 44,
      paddingRight: 0,
      borderRadius: 300,
      color: "grey.700",
      overflow: "hidden",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main"
      }
    },
    endAdornment: (
      <label htmlFor="image-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <CenterFocusWeakIcon style={{ marginInlineEnd: '12px' }} />
      </label>
    ),
    /*endAdornment: (
      <Fragment>
       
        <Button
          type="button"  // Add this line to prevent form submission
          color="primary"
          disableElevation
          variant="contained"
          sx={{
            px: "3rem",
            height: "100%",
            borderRadius: "0 300px 300px 0"
          }}

        >
          Search
        </Button>
      </Fragment>

    ),*/
    startAdornment: <SearchOutlinedIcon fontSize="small" />
  };
  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto" {...{ ref: parentRef }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Searching for..."
        onChange={handleKeyChange}
        onKeyDown={handleKeyPress}
        InputProps={INPUT_PROPS}
      />
      {resultList.length > 0 ? <SearchResult results={resultList} /> : null}
    </Box>
  );
};

export default SearchInput;
