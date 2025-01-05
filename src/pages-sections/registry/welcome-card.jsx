"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card"; // GLOBAL CUSTOM COMPONENTS

import { H3, H5, Paragraph } from "components/Typography"; // CUSTOM UTILS LIBRARY FUNCTION

import { currency } from "lib";

const WelcomeCard = ({ totalTokens, tokenPrice }) => {
  return <Card sx={{
    p: 3,
    height: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  }}>
    {/* <H5 color="info.main" mb={0.5}>
        Good Morning, Maruf!
      </H5>
      <Paragraph color="grey.600">
        Here’s what happening with your store today!
      </Paragraph> */}
    <Box>
      <H3 mt={3}>{currency(totalTokens * tokenPrice)}</H3>
      <Paragraph color="grey.600">Total Circulation Value</Paragraph>

      <H3 mt={1.5}>{currency(tokenPrice)}</H3>
      <Paragraph color="grey.600">GCN Avg</Paragraph>
    </Box>
    <Box sx={{
      right: 24,
      bottom: 0,
      //position: "absolute",
      display: {
        xs: "none",
        sm: "block"
      }
    }}>
      <Image width={195} height={171} alt="Welcome" src="/assets/images/illustrations/dashboard/welcome-02.png" />
    </Box>
  </Card>;
};

export default WelcomeCard;