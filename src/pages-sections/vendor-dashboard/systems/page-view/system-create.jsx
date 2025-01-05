"use client";

import { useRouter } from 'next/navigation';

import Box from "@mui/material/Box"; // GLOBAL CUSTOM COMPONENT

import { H3 } from "components/Typography"; // Local CUSTOM COMPONENT

import SystemForm from "../system-form";
import { backend, googleMapApi } from "utils/constants";

import { getCookie, UID } from 'utils/cookies-utils';

//import { showToast } from "utils/misc-utils";

const SystemCreatePageView = () => {
  const router = useRouter();

  const ownerId = getCookie(UID);

  return <Box py={4}>
      <H3 mb={2}>Create API Keys</H3>

      <SystemForm ownerId={ownerId}/>
    </Box>;
};

export default SystemCreatePageView;