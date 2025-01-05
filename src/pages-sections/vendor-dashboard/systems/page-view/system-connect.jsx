"use client";

import Box from "@mui/material/Box"; // GLOBAL CUSTOM COMPONENT

import { H3 } from "components/Typography"; // Local CUSTOM COMPONENT
import { useRouter } from 'next/navigation';

import SystemConnectForm from "../system-connect-form";
import { backend, googleMapApi } from "utils/constants";

import { getCookie, USER_LOCAL_ID } from "utils/cookies-utils";

import { showToast } from "utils/misc-utils";

const SystemConnectPageView = ({sites, selectedSiteIndex}) => {
  const ownerId = getCookie(USER_LOCAL_ID);
  const router = useRouter();

  const INITIAL_VALUES = {
    smeterid: "",
    smeterserial: "",
    siteid: "",
    pin: "",
    ownerid: ownerId,
    sites: sites || [],
  };
  const handleFormSubmit = async values => {
    console.log(values);
    const formData = new FormData();
    formData.append("smeterid", values.smeterid);
    formData.append("serial", values.smeterserial);
    formData.append("siteid", values.siteid);
    try {
      const response = await fetch('/projects/api/connect_system', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          console.log("Project is successfully connected");
          router.push('/projects');
        } else if (data.status === 'exist') {
          showToast("Meter is already in use", true);
          console.log('Exist: ', data.message);
        } else {
          console.log('Failed: ', data.message);
        }
      } else {
        showToast("Project creation failed", true);
        console.error('Failed to send request:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <Box py={4}>
    <H3 mb={2}>Connect Project</H3>
    <SystemConnectForm initialValues={INITIAL_VALUES} handleFormSubmit={handleFormSubmit} selectedSiteIndex={selectedSiteIndex} />
  </Box>;
};

export default SystemConnectPageView;