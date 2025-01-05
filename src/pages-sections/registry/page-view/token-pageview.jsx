"use client"
import React, { useEffect, useState, useRef } from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import WarningIcon from '@mui/icons-material/Warning';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip, IconButton } from '@mui/material';
import { Loader } from "@googlemaps/js-api-loader";
import { googleMapApi } from "utils/constants";
import GoogleMapLoader from "components/Map";
import axios from 'axios';
import { ethers } from 'ethers';
import { Alchemy, Network } from "alchemy-sdk";
import { format } from 'date-fns';

import { StatusWrapper } from 'pages-sections/vendor-dashboard/styles';

// Local CUSTOM COMPONENTS
import Sales from "../sales";
import Card1 from "../card-1";
import Analytics from "../analytics";
import WelcomeCard from "../welcome-card";
import RecentPurchase from "../recent-purchase";
import TokensList from "../tokens";
import TokensListProject from '../tokens-project';

import TokenFlow from 'components/token/token-flow';

import GreenChainsCoinABI from '../../../../abi/GreenChainsCoin.json';

// API FUNCTIONS
//import api from "utils/__api__/dashboard"; // DATA TYPES
import { H2, H4, H6 } from 'components/Typography';
import { grey } from 'theme/theme-colors';

import { countryCodeToFlag, kWh } from 'lib';

const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const networkRpc = process.env.NEXT_PUBLIC_NETWORK_RPC;
const ownerPrivateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY
const pinataJwt = process.env.NEXT_PUBLIC_PINATA_API_JWT;
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

const zerosAddress = "0x0000000000000000000000000000000000000000";

// to convert lat,lng to country
import api from 'utils/__api__/systems';

import { parseTokenBalance } from 'utils/misc-utils';

const theGraphEndpoint = process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT;

const TokenPageView = async ({ id }) => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalRetiredTokens, setTotalRetiredTokens] = useState(0);
  const [project, setProject] = useState();

  const [issuedAt, setIssuedAt] = useState();
  const [projectId, setProjectId] = useState();
  const [tokenId, setTokenId] = useState();
  const [tokenValue, setTokenValue] = useState(0);
  const [status, setStatus] = useState();
  const [projectName, setProjectName] = useState();
  const [projectType, setProjectType] = useState();
  const [projectCountry, setProjectCountry] = useState();
  const [projectCapacity, setProjectCapacity] = useState();
  const [projectDescription, setProjectDescription] = useState();

  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  const [projectLocation, setProjectLocation] = useState({ lat: 25.394087, lng: 55.438104 });

  const alchemy = new Alchemy({
    apiKey: alchemyApiKey,
    network: Network.MATIC_AMOY,
  });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: googleMapApi.apiKey,
        version: "weekly",
        libraries: ["places"]
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      const mapOptions = {
        center: projectLocation,
        zoom: 17,
        mapId: 'My_NEXTJS_MAP_ID'
      };

      const map = new Map(mapRef.current, mapOptions);

      const marker = new Marker({
        map: map,
        position: projectLocation,
        draggable: true
      });

      marker.addListener('dragend', () => {
        const newPosition = marker.getPosition();
        console.log('Marker dragged to:', newPosition.lat(), newPosition.lng());
        initialValues.lat = newPosition.lat();
        initialValues.lng = newPosition.lng();
      });

      map.addListener('click', (event) => {
        marker.setPosition(event.latLng);
        initialValues.lat = event.latLng.lat();
        initialValues.lng = event.latLng.lng();
      });

      // Initialize the Places Autocomplete for search functionality
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
      autocomplete.bindTo('bounds', map);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.error('Place not found or has no geometry');
          return;
        }

        map.setCenter(place.geometry.location);
        map.setZoom(17);

        marker.setPosition(place.geometry.location);
        initialValues.lat = place.geometry.location.lat();
        initialValues.lng = place.geometry.location.lng();
      });
    };

    initMap();
  }, [projectLocation]);

  useEffect(() => {
    const fetchTokenData = async () => {
      const query = `
        {
          tokens(where: {tokenId: "${id}"}) {
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
      
      try {
        const response = await fetch(theGraphEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        const tokenData = result.data.tokens[0];

        if (tokenData) {
          console.log(tokenData);
          setProject({
            id: tokenData.ipfsHashURI.projectId,
            name: tokenData.ipfsHashURI.projectName,
            capacity: Number(tokenData.ipfsHashURI.projectCapacity),
            description: tokenData.ipfsHashURI.projectDescription,
            location: {
              lat: Number(tokenData.ipfsHashURI.projectLat),
              lng: Number(tokenData.ipfsHashURI.projectLng)
            },
          });

          setTokenId(tokenData.tokenId);
          setProjectId(tokenData.ipfsHashURI.projectId);
          setStatus(Number(tokenData.burned));
          setIssuedAt(Number(tokenData.blockTimestamp) * 1000);
          setProjectName(tokenData.ipfsHashURI.projectName);
          setProjectCapacity(Number(tokenData.ipfsHashURI.projectCapacity));
          setProjectDescription(tokenData.ipfsHashURI.projectDescription);
          setTokenValue(Number(tokenData.amount));

          setProjectLocation({
            lat: Number(tokenData.ipfsHashURI.projectLat),
            lng: Number(tokenData.ipfsHashURI.projectLng)
          });
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [id]);

  useEffect(() => {
    const setCountryInfo = async () => {
      const country = await api.getCountryName(projectLocation.lat, projectLocation.lng);
      setProjectCountry(`${country.countryName} ${countryCodeToFlag(country.countryCode)}`);
    }

    setCountryInfo();

  }, [projectLocation]);

  return (
    <Box py={4} sx={{ width:"100%", maxWidth: "1390px", px: 2, md: { px: 4 } }}>
      <Grid container spacing={3} width='100%'>
        {/* WELCOME CARD SECTION */}
        <Grid item md={6} xs={12}>
          <div style={{ height: '600px' }} ref={mapRef}></div>
        </Grid>

        <Grid item md={6} xs={12}>
          <div key="id" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-10px" }}>ID</p>
            <H2>{tokenId ? `#${tokenId}` : "#N/A"}</H2>
          </div>
          <div key="value" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Value</p>
            <H4>{`${parseTokenBalance(tokenValue)} GCN `} {tokenValue < 1 && (
              <Tooltip title="Cannot be retired or transferred">
                <IconButton size='small'>
                  <InfoOutlinedIcon style={{ color: grey[600] }} />
                </IconButton>
              </Tooltip>
            )}</H4>
          </div>
          <div key="status" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Status</p>
            {tokenId ? status ? <StatusWrapper payment={true}><H4>{"Retired"}</H4></StatusWrapper> : <StatusWrapper payment={false}><H4>{"Active"}</H4></StatusWrapper> : "N/A"}
          </div>
          <div key="issuedAt" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-10px" }}>Issued At</p>
            <H4>{issuedAt ? format(new Date(issuedAt), 'yyyy-MM-dd HH:mm:ss') : "N/A"}</H4>
          </div>
          <div key="pname" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Name</p>
            <H4>{projectName? projectName : "N/A"}</H4>
          </div>
          <div key="ptype" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Type</p>
            <H4>{tokenId ? `Renewable Energy (PV)` : "N/A"}</H4>
          </div>
          <div key="pcapacity" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Capacity</p>
            <H4>{projectCapacity ? kWh(projectCapacity) : "N/A"}</H4>
          </div>
          <div key="pcountry" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Country</p>
            <H4>{projectCountry? projectCountry : "N/A"}</H4>
          </div>
          <div key="pdescription" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Description</p>
            <H4>{projectDescription ? projectDescription : "N/A"}</H4>
          </div>
        </Grid>

        {/* Token STAGES */}
        <Grid item xs={12} paddingBottom={4}>
          <TokenFlow tokenId={id}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TokenPageView;