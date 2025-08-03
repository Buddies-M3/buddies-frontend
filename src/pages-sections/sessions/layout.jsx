"use client";

import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import TerminalIcon from "@mui/icons-material/Terminal"; // LOCAL CUSTOM COMPONENTS

import BoxLink from "./box-link";
import LogoWithTitle from "./logo-title";
import LoginBottom from "./login-bottom";
import SocialButtons from "./social-buttons"; // GLOBAL CUSTOM COMPONENTS

import { FlexRowCenter } from "components/flex-box"; // COMMON STYLED COMPONENT

import { Wrapper } from "./styles";

const AuthLayout = ({
  children
}) => {
  const pathname = usePathname();
  let BOTTOM_CONTENT = null; // APPLIED FOR ONLY LOGIN PAGE

  const handleConsoleClick = () => {
    if (window.confirm('Open developer console?')) {
      console.log('Console access requested');
      // Open browser console programmatically
      if (window.chrome && window.chrome.devtools) {
        window.chrome.devtools.inspectedWindow.eval('console.log("Console opened")');
      } else {
        // Fallback: try to focus on console or provide instructions
        alert('Please press F12 or right-click → Inspect Element to open the developer console');
      }
    }
  };

  const ConsoleButton = () => (
    <Button
      variant="outlined"
      size="small"
      startIcon={<TerminalIcon />}
      onClick={handleConsoleClick}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        borderColor: 'grey.400',
        color: 'grey.700',
        '&:hover': {
          borderColor: 'grey.600',
          backgroundColor: 'grey.50'
        }
      }}
    >
      Console
    </Button>
  );

  if (pathname === "/login") {
    BOTTOM_CONTENT = <LoginBottom />;
  } // APPLIED FOR ONLY REGISTER PAGE


  if (pathname === "/register") {
    BOTTOM_CONTENT = <FlexRowCenter gap={1} mt={3} style={{opacity: 0.5}}>
        Already have an account?
        <span style={{color: '#666', textDecoration: 'none', cursor: 'not-allowed'}}>Login (Disabled)</span>
      </FlexRowCenter>;
  } // APPLIED FOR ONLY RESET PASSWORD PAGE


  if (pathname === "/reset-password") {
    return <FlexRowCenter flexDirection="column" minHeight="100vh" px={2}>
        <ConsoleButton />
        <Wrapper elevation={3}>{children}</Wrapper>
      </FlexRowCenter>;
  }

  return <FlexRowCenter flexDirection="column" minHeight="100vh" px={2}>
      <ConsoleButton />
      <Wrapper elevation={3}>
        {
        /* LOGO WITH TITLE AREA */
      }
        <LogoWithTitle />

        {
        /* FORM AREA */
      }
        {children}

        {
        /* SOCIAL BUTTON AREA */
      }
       {/*  <SocialButtons /> */}

        {
        /* RENDER BOTTOM CONTENT BASED ON CONDITION */
      }
        {BOTTOM_CONTENT}
      </Wrapper>
    </FlexRowCenter>;
};

export default AuthLayout;