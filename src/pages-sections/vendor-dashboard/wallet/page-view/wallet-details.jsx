"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import axios from "axios";
import { Box, Card, Grid, TextField, Button, MenuItem, Typography, List, ListItem, ListItemText } from '@mui/material';
import { H3 } from "components/Typography"; // Local CUSTOM COMPONENT
import GreenChainsCoinABI from '../../../../../abi/GreenChainsCoin.json';

import WalletCard from '../wallet';

import { getCookie, USER_LOCAL_ID } from 'utils/cookies-utils';
import WalletTransactions from '../transactions';
//import { showToast } from "utils/misc-utils";

const ALCHEMY_URL = `${process.env.NEXT_PUBLIC_ALCHEMY_URL}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const NETWORK_RPC = process.env.NEXT_PUBLIC_NETWORK_RPC

const WalletDetailsPageView = () => {
  const router = useRouter();

  const ownerId = getCookie(USER_LOCAL_ID);

  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);

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

  return (
    <Box py={4}>
      <WalletCard walletAddress={walletAddress}/>

      <WalletTransactions walletAddress={walletAddress}/>
    </Box>
  );
};

export default WalletDetailsPageView;
