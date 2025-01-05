"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Web3 from 'web3';

import { getCookie, USER_LOCAL_ID } from 'utils/cookies-utils';


// GLOBAL CUSTOM COMPONENTS

import { H3, H5, Paragraph } from "components/Typography";

// CUSTOM UTILS LIBRARY FUNCTION

import { currency } from "lib";
import { parseTokenBalance } from "utils/misc-utils";

const ALCHEMY_URL = `${process.env.NEXT_PUBLIC_ALCHEMY_URL}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const DECIMALS = 18; // Assuming GCN has 18 decimals
const theGraphEndpoint = process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT;


const BalanceCard = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [retired, setRetired] = useState(0);
  const [retiredCount, setRetiredCount] = useState(0);

  useEffect(() => {
    const getWalletAddress = async () => {
      const formData = new FormData();
      const ownerId = getCookie(USER_LOCAL_ID);

      if (ownerId) {
        formData.append('ownerid', ownerId);
        try {
          const response = await fetch('/green-credit/api/wallet_address', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              setWalletAddress(data.data.chainaddress);
            } else {
              console.log('Failed: ', data.message);
            }
          } else {
            console.error('Failed to send request:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    getWalletAddress();
  }, []);

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

  return <Card sx={{
    p: 3,
    height: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "row",
    justifyContent: "center"
  }}>
    <Box>
      <H5>Balance</H5>

      <H3 mt={3}>{parseTokenBalance(total - retired)}</H3>
      <Paragraph color="grey.600">GCN</Paragraph>

      <H3 mt={1.5}>{currency(parseTokenBalance(total - retired) * 4.9)}</H3>
      <Paragraph color="grey.600">Carbons Value</Paragraph>
    </Box>

    <Box sx={{
      paddingInlineStart: 10,
      display: {
        xs: "none",
        sm: "block"
      }
    }}>
      <Image width={155} height={171} alt="wallet" src="/assets/images/illustrations/dashboard/wallet.png" />
    </Box>
  </Card>;
};

export default BalanceCard;