"use client";

import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button"; // GLOBAL CUSTOM COMPONENTS

import { H5 } from "components/Typography";
import { FlexBetween } from "components/flex-box"; 

// Local CUSTOM COMPONENT
import { getCookie, USER_LOCAL_ID } from "utils/cookies-utils";

// API FUNCTIONS
import api from "utils/__api__/dashboard"; 

import DataListTable from "./table"; // DATA TYPES

// table column list
const tableHeading = [{
  id: "siteId",
  label: "Site ID",
  alignRight: false
}, {
  id: "site",
  label: "Site",
  alignRight: false
}, {
  id: "yield",
  label: "Yield",
  alignRight: false
}/* , {
  id: "average",
  label: "Average Generation",
  alignCenter: true
} */]; // ===================================================

// ===================================================
const SystemsInfo = ({
  data
}) => {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const ownerId = getCookie(USER_LOCAL_ID);
    
    const getStats = async () => {
      const formData = new FormData();
      formData.append("ownerid", ownerId);
      try {
        const response = await fetch('/dashboard/api/stats', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          // Handle errors
          console.error("Failed to get stats");
        }
      } catch (error) {
        console.error("Error get stats: ", error);
      }
    };

    getStats();
  }, []);

  return <Card>
      <FlexBetween px={3} py={2.5}>
        <H5>Sites Stats</H5>

        {/* <Button size="small" color="info" variant="outlined">
          All Projects
        </Button> */}
      </FlexBetween>

      <DataListTable dataList={stats} tableHeading={tableHeading} type="RECENT_PURCHASE" />
    </Card>;
};

export default SystemsInfo;