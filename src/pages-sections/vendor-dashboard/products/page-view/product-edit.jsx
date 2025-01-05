"use client";

import Box from "@mui/material/Box"; // GLOBAL CUSTOM COMPONENT

import { H3 } from "components/Typography"; // Local CUSTOM COMPONENT

import ProductForm from "../product-form";

const EditProductPageView = (system) => {
  const INITIAL_VALUES = {
    name: system.name,
    type: system.type,
    capacity: system.capacity,
    lat: system.latitude,
    lng: system.longitude,
    ownerid: system.ownerid
  };

  const handleFormSubmit = () => {};

  return <Box py={4}>
      <H3 mb={2}>Edit Product</H3>

      <ProductForm initialValues={INITIAL_VALUES} handleFormSubmit={handleFormSubmit} />
    </Box>;
};

export default EditProductPageView;