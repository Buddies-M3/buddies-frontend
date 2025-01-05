"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { H5 } from "components/Typography";
import axios from 'axios';
import { Box, Card, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button, MenuItem, Select, Checkbox, Divider, CircularProgress } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


import { FlexBetween } from "components/flex-box";
import DataListTable from "./table";

// Styled Button Component
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px', // Fully rounded corners
  backgroundColor: '#000', // Black background
  color: '#fff', // White text
  padding: '8px 24px', // Adjust padding for size
  '&:hover': {
    backgroundColor: '#333', // Darker black on hover
  },
}));

const tableHeading = [
  { id: "token_id", label: "ID", alignRight: false },
  { id: "value", label: "Value", alignRight: false },
  { id: "vintage_start", label: "From", alignRight: false },
  { id: "vintage_end", label: "To", alignRight: false },
  { id: "burned", label: "Status (Active/Retired)", alignRight: false },
  { id: "issuedAt", label: "Issued At", alignRight: false }
];

const TokensListProject = ({ projectId }) => {
  const [tokens, setTokens] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    minTokenAmount: "",
    maxTokenAmount: "",
    status: "-1"
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [burning, setBurning] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [nextPageKey, setNextPageKey] = useState(1);
  const [prevPageKeys, setPrevPageKeys] = useState([]); // Stack for previous page keys
  const [pageSize, setPageSize] = useState(25);

  const fetchTokenEvents = useCallback(async () => {
    let filter = `projectIpfsHash: "${projectId}"`;

    if (filters.startDate) filter += `, startDate_gte: "${new Date(filters.startDate).getTime() / 1000}"`;
    if (filters.endDate) filter += `, endDate_lte: "${new Date(filters.endDate).getTime() / 1000}"`;
    if (filters.minTokenAmount) filter += `, amount_gte: "${filters.minTokenAmount * 1000}"`;
    if (filters.maxTokenAmount) filter += `, amount_lte: "${filters.maxTokenAmount * 1000}"`;
    if (filters.status && filters.status !== "-1") filter += `, burned: ${filters.status}`;

    const filterString = filter ? `{ ${filter} }` : ''; // Remove the trailing comma and space

    const query = `
      {
        tokens(first: ${pageSize}, skip: ${pageKey * pageSize}${filterString ? `, where: ${filterString}` : ''}) {
          amount
          blockTimestamp
          burned
          endDate
          id
          owner
          projectIpfsHash
          startDate
          tokenId
          ipfsHashURI {
            projectCapacity
            projectDescription
            projectId
            projectLat
            projectLng
            projectName
            projectType
          }
        }
      }
    `;

    console.log(query);

    const response = await axios.post(process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT, { query });
    if (response.data && response.data.data.tokens.length > 0) {
      const reconstructedTokens = response.data.data.tokens.map(token => ({
        token_id: token.tokenId,
        amount: token.amount,
        start_date: token.startDate,
        end_date: token.endDate,
        project_name: token.ipfsHashURI.projectName,
        project_type: token.ipfsHashURI.projectType,
        burned: token.burned,
        issued_at: token.blockTimestamp,
      }));
      setTokens(reconstructedTokens);
    } else {
      setTokens([]);
    }
  }, [projectId, appliedFilters, pageSize, pageKey]);

  useEffect(() => {
    fetchTokenEvents();
  }, [fetchTokenEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleSelectRow = (tokenId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(tokenId)) {
        return prevSelected.filter((id) => id !== tokenId);
      } else {
        return [...prevSelected, tokenId];
      }
    });
  };

  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      console.log(selectedRows);
      const allIds = transactions.map((tx) => tx.tokenId);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      minTokenAmount: "",
      maxTokenAmount: "",
      status: "-1"
    });
  }

  const handleNextPage = () => {
    if (nextPageKey) {
      setPrevPageKeys(prevKeys => [...prevKeys, pageKey]); // Save current page key to stack
      setPageKey(nextPageKey); // Move to the next page
    }
  };

  const handlePreviousPage = () => {
    if (prevPageKeys.length > 0) {
      const newPrevKeys = [...prevPageKeys];
      const lastPrevKey = newPrevKeys.pop(); // Get last previous page key
      setPageKey(lastPrevKey); // Move to the previous page
      setPrevPageKeys(newPrevKeys); // Update stack
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageKey(0); // Reset pageKey to fetch from the start
    setPrevPageKeys([]); // Clear previous page keys on page size change
  };

  return (
    <Box py={4}>
      {/* Filter Card */}
      <Card sx={{ marginBottom: 3 }}>
        <Box p={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="dd-MMM-yy"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange({ target: { name: 'startDate', value: date } })}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="dd-MMM-yy"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange({ target: { name: 'endDate', value: date } })}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  name="minTokenAmount"
                  value={filters.minTokenAmount}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  name="maxTokenAmount"
                  value={filters.maxTokenAmount}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Select
                  fullWidth
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  defaultValue="-1"
                  size='small'
                >
                  <MenuItem value="-1">All</MenuItem>
                  <MenuItem value="0">Active</MenuItem>
                  <MenuItem value="1">Retired</MenuItem>
                </Select>

              </Grid>
            </Grid>
            <Box mt={2} display="flex" justifyContent="start">
              <StyledButton variant="contained" color="primary" onClick={applyFilters}>
                Apply Filters
              </StyledButton>
              <StyledButton variant="outlined" color="secondary" onClick={clearFilters} sx={{ marginInlineStart: 2 }}>
                Clear Filters
              </StyledButton>
            </Box>
          </LocalizationProvider>
        </Box>
      </Card>

      {/* Table Card */}
      <Card sx={{ height: "100%" }}>
        <DataListTable
          dataList={tokens}
          tableHeading={tableHeading}
          type="STOCK_OUT"
          data={tokens}
        />
        <Stack direction="row" justifyContent="center" alignItems="center" my={4} spacing={2}>
          <StyledButton
            variant="contained"
            disabled={prevPageKeys.length === 0} // Disable if no previous page key in stack
            onClick={handlePreviousPage}
          >
            Previous
          </StyledButton>
          <StyledButton
            variant="contained"
            disabled={!nextPageKey} // Disable if no next page key
            onClick={handleNextPage}
          >
            Next
          </StyledButton>
        </Stack>
        <Box display="flex" justifyContent="end" paddingBottom={2.5} paddingInlineEnd={3} mt={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Page Size"
            >
              {[25, 50, 100].map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>
    </Box>
  );
};

export default TokensListProject;