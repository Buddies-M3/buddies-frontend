import { cache } from "react";
import axios from "axios";
import { backend } from "utils/constants";

const getSystems = async (ownerid) => {
  try {
    const response = await axios.get(`${backend.host}/api/site/owner/${ownerid}`);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
};

const getSystem = cache(async (systemid) => {
  try {
    const response = await axios.get(`${backend.host}/api/site/${systemid}`);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
});

const getRelevantSMeter = cache(async (capacity) => {
  try {
    const response = await axios.get(`${backend.host}/api/smeter/relevant/${capacity}`);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
});

const verifySMeterSerial = cache(async (serial) => {
  try {
    const response = await axios.get(`${backend.host}/api/smeter/serial/${serial}`);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
});

const verifySMeterPin = cache(async (serial, pin) => {
  try {
    const response = await axios.post(`${backend.host}/api/smeter/verify/${serial}/${pin}`);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
});

const addSystem = cache(async (system) => {
  try {
    const response = await axios.post(`${backend.host}/api/site`, system, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    console.log(response.data);
    return response.status == 201;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});

const updateSystem = cache(async (system) => {
  try {
    const response = await axios.put(`${backend.host}/api/site/${system.id}`, system, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    console.log(response.data);
    return response.status == 201;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});

const deleteSystem = cache(async (id) => {
  try {
    const response = await axios.delete(`${backend.host}/api/site/${id}`, null, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    return response.status == 200;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});


async function getCountry(x, y) {
  const test_api = "http://api.geonames.org/";
  const API_URL = 'https://restcountries.com/v3.1';
  try {
    // Make a request to fetch country information based on coordinates
    console.log(`${test_api}countryCodeJSON?lat=${x}&lng=${y}&username=greenchain`);
    const response = await axios.get(`${test_api}countryCodeJSON?lat=${x}&lng=${y}&username=greenchain`);

    // Extract the country code from the response
    const countryCode = response.data.countryCode;

    return countryCode;
  } catch (error) {
    console.error('Error fetching country flag:', error);
    return null;
  }
}

async function getCountryName(x, y) {
  const test_api = "http://api.geonames.org/";
  const API_URL = 'https://restcountries.com/v3.1';
  try {
    // Make a request to fetch country information based on coordinates
    console.log(`${test_api}countryCodeJSON?lat=${x}&lng=${y}&username=greenchain`);
    const response = await axios.get(`${test_api}countryCodeJSON?lat=${x}&lng=${y}&username=greenchain`);

    if(response.data) return response.data;
  } catch (error) {
    console.error('Error fetching country flag:', error);
    return null;
  }
}

async function getCity(x, y) {
  const test_api = "http://api.geonames.org/";
  const API_URL = 'https://restcountries.com/v3.1';
  try {
    // Make a request to fetch country information based on coordinates
    const response = await axios.get(`${test_api}countrySubdivisionJSON?lat=${x}&lng=${y}&username=greenchain`);
    console.log(response);
    // Extract the country code from the response
    const city = response.data.adminName1;

    return city;
  } catch (error) {
    console.error('Error fetching country flag:', error);
    return null;
  }
}

const connectSystem = cache(async (connection) => {

  console.log(connection);
  try {
    const response = await axios.post(`${backend.host}/api/connection`, connection, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response);
      return { status: error.response.status, data: error.response.data };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      return { status: 500, data: 'No response received from server' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      return { status: 500, data: error.message };
    }
  }
});


const isConnected = cache(async (systemid) => {
  try {
    const response = await axios.get(`${backend.host}/api/connection/site/${systemid}`);
    if (response.status == 200)
      return { status: 'connected', data: response.data };
  } catch (error) {
    if (error.response.status == 400) {
      return { status: 'unconnected' };
    } else {
      return { status: 'error' };
    }
  }
});

const deleteConnection = cache(async (connectionId) => {
  try {
    const response = await axios.delete(`${backend.host}/api/connection/${connectionId}`, null, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    return response.status == 200;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});

export default {
  getSystems,
  getSystem,
  getCountry,
  getCountryName,
  getCity,
  addSystem,
  updateSystem,
  deleteSystem,
  getRelevantSMeter,
  verifySMeterPin,
  verifySMeterSerial,
  connectSystem,
  isConnected,
  deleteConnection
}