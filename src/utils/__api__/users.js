import { cache } from "react";
import axios from "axios";
import { backend } from "utils/constants";

const createUser = async (email, fullName, chainaddress) => {
  const owner = {
    fname: fullName,
    email: email,
    chainaddress: chainaddress
  }
  try {
    const response = await axios.post(`${backend.host}/api/owner`, owner, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    return response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
}

const getUser = async (email) => {

  try {
    const response = await axios.get(`${backend.host}/api/owner/${email}`, null, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    return response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
}

const getUserById = async (id) => {

  try {
    const response = await axios.get(`${backend.host}/api/owner/id/${id}`, null, {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${backend.key}`
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
}

export default {
  getUserById,
  getUser,
  createUser
};