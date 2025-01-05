import { cache } from "react";
import axios from "axios";
import { backend } from "utils/constants";

const getStats = async (ownerid) => {
  try {
    const response = await axios.get(`${backend.host}/api/site/stats/${ownerid}`);
    return response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
};

const getAnalytics = async (ownerid) => {
  try {
    const response = await axios.get(`${backend.host}/api/site/recordings/${ownerid}`);
    return response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
    return false;
  }
};

export default {
  getStats,
  getAnalytics
};
