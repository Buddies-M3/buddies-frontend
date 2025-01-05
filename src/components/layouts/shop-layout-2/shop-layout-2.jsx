"use client";

import { usePathname } from "next/navigation";
import { Fragment, useCallback, useState } from "react";
import { Box } from "@mui/material"; // Import Box from Material-UI
// GLOBAL CUSTOM COMPONENTS

import { Sticky } from "components/sticky";
import { Topbar } from "components/topbar";
//import { Header } from "components/header";
import Header from "front-page/components/Header";
import Footer from "front-page/components/Footer";
import { Navbar } from "components/navbar";
import { SearchInput } from "components/search-box";
/**
 *  USED IN:
 *  1. grocery-1, grocery-2, health-beauty-shop
 *  2. checkout-alternative
 */

const ShopLayout2 = ({
  children
}) => {
  const pathname = usePathname();
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback(fixed => setIsFixed(fixed), []); // FOR HANDLE TOP BAR AREA

  const [searchText, setSearchText] = useState("");

  let TOP_BAR_CONTENT = null;
  const SHOW_TOP_BAR = ["/grocery-2", "/health-beauty-shop", "/checkout-alternative"];

  if (SHOW_TOP_BAR.includes(pathname)) {
    TOP_BAR_CONTENT = <Topbar />;
  } // FOR HANDLE NAV BAR AREA


  let NAV_BAR_CONTENT = null;
  const SHOW_NAV_BAR = ["/health-beauty-shop", "/checkout-alternative"];

  const SHORT_FOOTER_CONTENT = ["/registry"];
  const SHORT_FOOTER = SHORT_FOOTER_CONTENT.some(path => pathname.startsWith(path));

  if (SHOW_NAV_BAR.includes(pathname)) {
    NAV_BAR_CONTENT = <Navbar elevation={0} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      {TOP_BAR_CONTENT}

      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={70}>
        <Header isFixed={isFixed} searchInput={<SearchInput />} />
      </Sticky>

      {NAV_BAR_CONTENT}

      <Box
        component="main"
        sx={{
          flex: 1
        }}
      >
        {children}
      </Box>

      <Footer isShort={SHORT_FOOTER} sx={{ marginTop: 'auto' }} />
    </Box>
  );
};

export default ShopLayout2;