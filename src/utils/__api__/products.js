import { cache } from "react";
import axios from "axios";
// get all product slug
const getSlugs = cache(async () => {
  const response = await axios.get("/api/products/slug-list");
  return response.data;
}); // get product based on slug

const getProduct = cache(async slug => {
  const response = await axios.get("/api/products/slug", {
    params: {
      slug
    }
  });
  return response.data;
}); // search products

/*const searchProducts = cache(async (name, category) => {
  const response = await axios.get("/api/products/search", {
    params: {
      name,
      category
    }
  });
  return response.data;
});*/


const searchProducts = cache(async (searchText) => {
  // Create a FormData object
  const formData = new FormData();
  // Append the search text parameter to the FormData object
  formData.append('query', searchText);

  try {
    // Make a POST request with FormData
    const response = await axios.post("http://localhost:5000/search", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});

const searchByImage = cache(async (image) => {
  // Create a FormData object
  const formData = new FormData();
  // Append the search text parameter to the FormData object
  formData.append('image', image);

  try {
    // Make a POST request with FormData
    const response = await axios.post("http://localhost:5000/search", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    //throw error;
  }
});



const getSuggestions = cache(async (input) => {
  /*const response = await axios.get("/api/products/search", {
    params: {
      name,
      category
    }
  });
  return response.data;*/
});

export default {
  getSlugs,
  getProduct,
  searchProducts,
  getSuggestions,
  searchByImage
};