import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { createHash } from 'crypto';

import crypto from 'crypto';

export function generateApiKey(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const charactersLength = characters.length;
    let apiKey = '';
    const randomValues = new Uint32Array(length);
  
    window.crypto.getRandomValues(randomValues);
  
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charactersLength;
      apiKey += characters[randomIndex];
    }
  
    return apiKey;
  }


export const showToast = (message, error = false) => {
    if (!error) {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    else {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

};

export const getMonthlyCategories = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIndex = new Date().getMonth(); // Get current month index (0-11)
  const categoriesMonthly = [];

  // Loop through the months, starting from the current month and going backwards
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonthIndex - i + 12) % 12;
    categoriesMonthly.unshift(months[monthIndex]);
  }

  return categoriesMonthly;
};

export const parseTokenBalance = (amount) => {
  return Number(amount / 1000);
}


/* export function generateSecret() {
    return createHash('sha256').update(Date.now().toString()).digest('hex');
}

export const convertCurrency = async (price, fromCurrency, toCurrency) => {
    const forexUrl = `https://api.exchangerate-api.com/v4/latest/${toCurrency}`;
    try {
      // Make a GET request to the API
      const response = await fetch(forexUrl);

      // Check if the request was successful (status code 200)
      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();

        // Check if the provided currency code exists in the exchange rates data
        if (fromCurrency in data.rates) {
          // Convert the price using the exchange rate
          const convertedPrice = price / data.rates[fromCurrency];
          return convertedPrice;
        } else {
          console.error(`Currency code '${fromCurrency}' not found.`);
        }
      } else {
        console.error(`Unable to fetch exchange rates. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

// Function to download a file from a URL and return the file data
export const downloadFile = async (url, fileName) => {
  try {
    // Send a GET request to the URL to fetch the image
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Determine the content type of the response
    const contentType = response.headers['content-type'];

    // Check if the response contains an image
    if (!contentType || !contentType.startsWith('image')) {
      throw new Error(`The response from the provided URL does not contain an image.`);
    }

    // Create a Blob object from the image data
    const blob = new Blob([response.data], { type: contentType });

    // Create a File object from the Blob
    const file = new File([blob], fileName, { type: contentType });

    // Return the File object
    return file;
  } catch (error) {
    throw new Error(`Error downloading image from ${url}: ${error.message}`);
  }
}; */