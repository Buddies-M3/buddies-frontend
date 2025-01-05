"use client"
import React, { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from 'axios';
import { ethers } from 'ethers';
import Card1 from "../card-1";
import WelcomeCard from "../welcome-card";
import TokensList from '../tokens';
import WalletTransactions from 'pages-sections/vendor-dashboard/wallet/transactions';
import GreenChainsCoinABI from '../../../../abi/GreenChainsCoin.json';

import { parseTokenBalance } from 'utils/misc-utils';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const networkRpc = process.env.NEXT_PUBLIC_NETWORK_RPC;
const ownerPrivateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const theGraphEndpoint = process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT;

const RegistryPageView = () => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalRetiredTokens, setTotalRetiredTokens] = useState(0);
  const [vintages, setVintages] = useState(0);
  const [projects, setProjects] = useState(0);

  useEffect(() => {
    const fetchGraphQLData = async () => {
      const query = `
        query tokenStatsAllTimes {
          tokenStatsAllTimes {
            totalBalance
            totalBurnedBalance
            totalBurnedCount
            totalCount
            projectCount
          }
        }
      `;

      try {
        const response = await fetch(theGraphEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        if (result.data && result.data.tokenStatsAllTimes.length > 0) {
          setTotalTokens(parseTokenBalance(result.data.tokenStatsAllTimes[0].totalBalance));
          setVintages(result.data.tokenStatsAllTimes[0].totalCount);
          setTotalRetiredTokens(parseTokenBalance(result.data.tokenStatsAllTimes[0].totalBurnedBalance));
          setProjects(result.data.tokenStatsAllTimes[0].projectCount);
        } else {
          console.error('No data found in GraphQL response');
        }
      } catch (error) {
        console.error('Error fetching GraphQL data:', error);
      }
    };

    fetchGraphQLData();
  }, []);

  /* useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const url = `https://api.pinata.cloud/data/pinList?status=pinned`;

        const response = await axios.get(url, {
          headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataApiSecret
          }
        });
        if (response.data) {
          setProjects(response.data.count);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactionHistory();
  }, []); */

  return (
    <Box py={4} sx={{ maxWidth: "1390px", px: 2, md: { px: 4 } }}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WelcomeCard totalTokens={totalTokens} tokenPrice={4.66} />
        </Grid>
        <Grid container item md={6} xs={12} spacing={3}>
          <Grid item md={6} sm={6} xs={12} key="issued">
            <Card1 title="Total Issued GCNs" amount1={totalTokens} />
          </Grid>
          <Grid item md={6} sm={6} xs={12} key="retired">
            <Card1 title="Total Retired GCNs" amount1={totalRetiredTokens} />
          </Grid>
          <Grid item md={6} sm={6} xs={12} key="projects">
            <Card1 title="Total Projects" amount1={projects} />
          </Grid>
          <Grid item md={6} sm={6} xs={12} key="projects">
            <Card1 title="Total Vintages" amount1={vintages} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TokensList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegistryPageView;