"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Alchemy, Network } from "alchemy-sdk";
import { Box, Card, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button, MenuItem, Select, Checkbox, Divider, CircularProgress } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Local CUSTOM COMPONENT
import { H3 } from "components/Typography";
import { TableHeader, TablePagination } from "components/data-table";
import Scrollbar from "components/Scrollbar";
import useMuiTable from "hooks/useMuiTable";

import { getCookie, USER_LOCAL_ID } from 'utils/cookies-utils';
import GreenChainsCoinABI from '../../../abi/GreenChainsCoin.json';
import TransactionRow from 'pages-sections/vendor-dashboard/wallet/transaction-row';
import { quartersInYear } from 'date-fns';
import { ProgressBar } from 'components/progress';
///import { StyledButton } from 'pages-sections/registry/styles';

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

const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const networkRpc = process.env.NEXT_PUBLIC_NETWORK_RPC;
const theGraphEndpoint = process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT;

// TABLE HEADING DATA LIST
const tableHeading = [
  { id: "tokenId", label: "ID", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
  { id: "project", label: "Project", align: "left" },
  { id: "vintage", label: "Vintage", align: "center" },
  { id: "status", label: "Status", align: "center" }
];

const TokensList = ({ walletAddress }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [transactions, setTransactions] = useState([]);
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

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: transactions
  });

  const fetchTransactionHistory = async (filters) => {
    try {
      let filter = '';
      if (filters.startDate) filter += `startDate_gte: "${new Date(filters.startDate).getTime() / 1000}", `;
      if (filters.endDate) filter += `endDate_lte: "${new Date(filters.endDate).getTime() / 1000}", `;
      if (filters.minTokenAmount) filter += `amount_gte: "${filters.minTokenAmount * 1000}", `;
      if (filters.maxTokenAmount) filter += `amount_lte: "${filters.maxTokenAmount * 1000}", `;
      if (filters.status && filters.status != "-1") filter += `burned: ${filters.status}, `;

      const filterString = filter ? `{ ${filter.slice(0, -2)} }` : ''; // Remove the trailing comma and space

      const query = `
      {
        tokens(first: ${pageSize}, skip: ${pageKey * pageSize}${filterString ? `, where: ${filterString}` : ''}) {
          amount
          projectIpfsHash
          ipfsHashURI {
            projectType
            projectName
            projectLng
            projectLat
            projectCapacity
            projectDescription
          }
          blockTimestamp
          burned
          endDate
          owner
          startDate
          tokenId
        }
      }
      `;
      console.log(query);
      const response = await axios.post(theGraphEndpoint, { query });

      if (response.data.data.tokens) {
        setTransactions(response.data.data.tokens);
        if (response.data.data.tokens.length <= pageSize) {
          setNextPageKey(pageKey + 1);
        }
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }

  };

  useEffect(() => {
    fetchTransactionHistory(appliedFilters);
  }, [walletAddress, appliedFilters, pageSize, pageKey]);

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
      <Card>
        <Scrollbar autoHide={false}>
          <TableContainer sx={{ minWidth: 900 }}>
            <Table>
              <TableHeader
                hideSelectBtn
                order={order}
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={transactions.length}
                numSelected={selectedRows.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {transactions.map((tx, index) => (
                  <TransactionRow
                    hideSelectBtn
                    key={index}
                    checked={selectedRows.includes(tx.tokenId)}
                    tx={{
                      tokenId: tx.tokenId,
                      projectType: tx.ipfsHashURI.projectType,
                      amount: tx.amount,
                      projectName: tx.ipfsHashURI.projectName,
                      startDate: Number(tx.startDate),
                      endDate: Number(tx.endDate),
                      status: tx.burned,
                      projectIpfsHash: tx.projectIpfsHash
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
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

export default TokensList;