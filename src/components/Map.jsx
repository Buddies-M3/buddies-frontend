'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
//import { Map, GoogleApiWrapper } from 'google-maps-react';
import { googleMapApi } from 'utils/constants';

const mapStyles = {
  width: '100%',
  height: '50%'
};


const GoogleMapLoader = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapApi.apiKey,
      version: "weekly",
    });

    loader.load().then(() => {
      const google = window.google;
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: googleMapApi.initialLat, lng: googleMapApi.initialLng },
        zoom: 8,
      });
      setMap(map);
    });
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMapLoader;

