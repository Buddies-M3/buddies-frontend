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

const ProjectPageView = async ({ id }) => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalRetiredTokens, setTotalRetiredTokens] = useState(0);
  const [project, setProject] = useState({});

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

  const [projectLocation, setProjectLocation] = useState({ lat: 0.394087, lng: 0.438104 });

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
      try {
        const query = `
          {
            tokens(where: {projectIpfsHash: "${id}"}) {
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
        const response = await axios.post(process.env.NEXT_PUBLIC_THEGRAPH_ENDPOINT, { query });
        
        if (response.data && response.data.data.tokens.length > 0){
          const projectData = response.data.data.tokens[0];
          
          setProject({
            projectId: projectData.ipfsHashURI.projectId,
            projectName: projectData.ipfsHashURI.projectName,
            projectType: projectData.ipfsHashURI.projectType,
            projectLat: projectData.ipfsHashURI.projectLat,
            projectLng: projectData.ipfsHashURI.projectLng,
            projectDescription: projectData.ipfsHashURI.projectDescription,
            projectCapacity: projectData.ipfsHashURI.projectCapacity
          });
          setProjectLocation({lat: Number(projectData.ipfsHashURI.projectLat), lng: Number(projectData.ipfsHashURI.projectLng)});
        }
        
      } catch (error) {
        console.error('Error fetching project transaction:', error);
      }
    }

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
    <Box py={4} sx={{ width: "100%", maxWidth: "1390px", px: 2, md: { px: 4 } }}>
      <Grid container spacing={3} width='100%'>
        {/* WELCOME CARD SECTION */}
        <Grid item md={6} xs={12}>
          <div style={{ height: '600px' }} ref={mapRef}></div>
        </Grid>

        <Grid item md={6} xs={12}>
          <div key="id" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-10px" }}>Project Name</p>
            <H2>{project && project.projectName ? `#${project.projectName}` : "#N/A"}</H2>
          </div>
          <div key="ptype" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Type</p>
            <H4>{project && project.projectId ? `Renewable Energy (PV)` : "N/A"}</H4>
          </div>
          <div key="pcapacity" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Capacity</p>
            <H4>{project && project.projectCapacity ? kWh(project.projectCapacity) : "N/A"}</H4>
          </div>
          <div key="pcountry" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Country</p>
            <H4>{projectCountry ? projectCountry : "N/A"}</H4>
          </div>
          <div key="pdescription" style={{ marginBottom: "10px" }}>
            <p style={{ color: grey[600], marginBottom: "-5px" }}>Project Description</p>
            <H4>{project && project.projectDescription ? project.projectDescription : "N/A"}</H4>
          </div>
        </Grid>

        {/* Tokens */}
        <Grid item xs={12}>
          <TokensListProject projectId={id}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectPageView;