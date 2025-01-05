"use client";

import Box from "@mui/material/Box"; // GLOBAL CUSTOM COMPONENT

import { H3 } from "components/Typography"; // Local CUSTOM COMPONENT

import SystemForm from "../system-form";

import { showToast } from "utils/misc-utils";

const EditSystemPageView = ({system}) => {
  const INITIAL_VALUES = {
    id: system.id,
    name: system.name,
    description: system.description,
    type: system.type,
    capacity: system.capacity,
    lat: system.latitude,
    lng: system.longitude,
    ownerid: system.ownerid
  };

  const handleFormSubmit = async (values) => {
    const system = {
      id: values.id,
      name: values.name,
      description: values.description,
      type: values.type,
      capacity: values.capacity,
      latitude: values.lat,
      longitude: values.lng,
      ownerid: values.ownerid
    };

    const formData = new FormData();
     formData.append("system", JSON.stringify(system));
    try {
      const response = await fetch('/projects/api/update_system', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          showToast("Project is successfully updated");
          console.log("Project is successfully updated");
        }
      } else {
        //showToast("System creation failed", true);
        console.error('Failed to send request:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <Box py={4}>
      <H3 mb={2}>Edit Project</H3>

      <SystemForm initialValues={INITIAL_VALUES} handleFormSubmit={handleFormSubmit} edit={true}/>
    </Box>;
};

export default EditSystemPageView;