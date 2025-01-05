import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Button } from '@mui/material';
import { H2, H6 } from "components/Typography"; // Local CUSTOM COMPONENT
import { ethers, BigNumber } from 'ethers';
import { grey } from 'theme/theme-colors';
import GreenChainsCoinABI from '../../../../abi/GreenChainsCoin.json';
import { parseTokenBalance } from 'utils/misc-utils';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const NETWORK_RPC = process.env.NEXT_PUBLIC_NETWORK_RPC;
const theGraphEndpoint = process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT;

const WalletCard = ({ walletAddress }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [retired, setRetired] = useState(0);
  const [retiredCount, setRetiredCount] = useState(0);

  useEffect(() => {
    const fetchGraphQLData = async () => {
      const query = `
        query tokenStatsOwner($id: ID!) {
          tokenStatsOwner(id: $id) {
            totalBalance
            totalBurnedBalance
            totalBurnedCount
            totalCount
          }
        }
      `;

      try {
        const response = await fetch(theGraphEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { id: walletAddress } }),
        });

        const result = await response.json();

        if (result.data && result.data.tokenStatsOwner) {
          const { totalBalance, totalBurnedBalance, totalBurnedCount, totalCount } = result.data.tokenStatsOwner;
          setRetired(totalBurnedBalance);
          setTotal(totalBalance);
          setTotalCount(totalCount);
          setRetiredCount(totalBurnedCount);
          // Uncomment to set other state values if needed
          // setVintages(totalCount);
          // setTotalRetiredTokens(totalBurnedBalance);
          // setProjects(totalBurnedCount);
        } else {
          console.error('No data found in GraphQL response');
        }
      } catch (error) {
        console.error('Error fetching GraphQL data:', error);
      }
    };

    if (walletAddress) {
      fetchGraphQLData();
    }
  }, [walletAddress]);

  return (
    <Box py={4} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
      <Card sx={{ p: 6, flex: '6 3 0%', minWidth: 400 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <H6 color={grey[600]}>Balance (Count)</H6>
            <H2>{parseTokenBalance(total - retired)} GCN ({totalCount - retiredCount})</H2>
            <Box sx={{ marginBlockStart: 2 }}>
              <H6 color={grey[600]}>{walletAddress}</H6>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 6, flex: '3 3 0%', minWidth: 300 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <H6 color={grey[600]}>Total (Count)</H6>
            <H2>{parseTokenBalance(total)} GCN ({totalCount})</H2>
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 6, flex: '3 3 0%', minWidth: 300 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <H6 color={grey[600]}>Retired (Count)</H6>
            <H2>{parseTokenBalance(retired)} GCN ({retiredCount})</H2>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default WalletCard;