"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

// GLOBAL CUSTOM COMPONENTS

import { H3, H5, Paragraph } from "components/Typography";

// CUSTOM UTILS LIBRARY FUNCTION

import { currency } from "lib";

const SummaryCard = () => {
  return <Card sx={{
    p: 3,
    height: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center"
}}>
    {/* First Section */}
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            borderRadius: '10px',
            mb: {
                md: 2,
                xs: 10,
            },
            textAlign: 'center',
            position: 'relative',
        }}
    >
        {/* Content for First Section */}
    </Box>

    {/* Separator Line */}
    <Box sx={{
        width: "1px",
        backgroundColor: "grey.300",
        alignSelf: "stretch",
        mx: 3
    }} />

    {/* Second Section: System Information */}
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            color: 'white',
            borderRadius: '10px',
            mb: {
                md: 2,
                xs: 10,
            },
            textAlign: 'center',
            position: 'relative',
        }}
    >
        <Image width={195} height={171} alt="Solar Panels" src="/assets/images/illustrations/dashboard/solar-panels.png" />
        <Box>
        <H3 mt={3}>Rashideya Site 3kWp</H3>
      <Paragraph color="grey.600">Name</Paragraph>
      <H3 mt={3}>Shkh Rashid Bin Humeed Strt, Rashideya3, Ajman One Towers, Ajman, UAE</H3>
      <Paragraph color="grey.600">Address</Paragraph>
      <H3 mt={3}>Rashideya Site 3kWp</H3>
      <Paragraph color="grey.600">Name</Paragraph>
      <H3 mt={3}>Rashideya Site 3kWp</H3>
      <Paragraph color="grey.600">Name</Paragraph>
            <Paragraph>Name: Solar Power System</Paragraph>
            <Paragraph>Location: Your Location</Paragraph>
            <Paragraph>Total Capacity: 100 kW</Paragraph>
            <Paragraph>Total Yield: 50000 kWh</Paragraph>
        </Box>
    </Box>
</Card>;


};

export default SummaryCard;