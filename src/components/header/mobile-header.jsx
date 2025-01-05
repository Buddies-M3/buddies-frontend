import Link from "next/link";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton"; 
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';


// MUI ICON COMPONENT

import Clear from "@mui/icons-material/Clear"; // CUSTOM ICON COMPONENTS

import Icon from "icons"; // LOCAL CUSTOM COMPONENTS

import DialogDrawer from "./dialog-drawer"; // GLOBAL CUSTOM COMPONENTS

import Image from "components/BazaarImage";
import { Paragraph } from "components/Typography";
import { MobileMenu } from "components/navbar/mobile-menu";
import { FlexBetween, FlexBox } from "components/flex-box"; // GLOBAL CUSTOM HOOK

import useCart from "hooks/useCart"; // LOCAL CUSTOM HOOK

import useHeader from "./use-header"; // ==============================================================

// ==============================================================
const MobileHeader = ({
  searchInput
}) => {
  const {
    state
  } = useCart();
  const {
    dialogOpen,
    sidenavOpen,
    searchBarOpen,
    toggleDialog,
    toggleSearchBar,
    toggleSidenav
  } = useHeader();
  const ICON_STYLE = {
    color: "grey.600",
    fontSize: 20
  };
  return <Fragment>
    <FlexBetween width="100%">
      {
        /* LEFT CONTENT - NAVIGATION ICON BUTTON */
      }
      <Box flex={1}>
        <MobileMenu />
      </Box>

      {
        /* MIDDLE CONTENT - LOGO */
      }
      <Link href="/">
        <Image height={55} src="/assets/images/icons/logo.png" padding="10px" alt="logo" style={{ borderRadius: '10%' }} />
      </Link>

      {
        /* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */
      }
      <FlexBox justifyContent="end" flex={1}>
        <Link href='/'>
          <Box component={IconButton} onClick={toggleDialog}>
            <LoginIcon sx={ICON_STYLE} />
          </Box>
        </Link>
        <Link href='/register'><Box component={IconButton} onClick={toggleSidenav}>
          <PersonIcon sx={ICON_STYLE} />
        </Box>
        </Link>
      </FlexBox>
    </FlexBetween>

    {
      /* SEARCH FORM DRAWER */
    }
    {/* <Drawer open={searchBarOpen} anchor="top" onClose={toggleSearchBar} sx={{
      zIndex: 9999
    }}>
      <Box sx={{
        width: "auto",
        padding: 2,
        height: "100vh"
      }}>
        <FlexBetween mb={1}>
          <Paragraph>Search to Bazaar</Paragraph>

          <IconButton onClick={toggleSearchBar}>
            <Clear />
          </IconButton>
        </FlexBetween>

        {searchInput}
      </Box>
    </Drawer> */}

    {
      /* LOGIN FORM DIALOG AND CART SIDE BAR  */
    }
    {/* <DialogDrawer dialogOpen={dialogOpen} sidenavOpen={sidenavOpen} toggleDialog={toggleDialog} toggleSidenav={toggleSidenav} /> */}
  </Fragment>;
};

export default MobileHeader;