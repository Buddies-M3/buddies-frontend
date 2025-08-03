import Search from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import TerminalIcon from "@mui/icons-material/Terminal";
import { FlexBox } from "components/flex-box"; // Local CUSTOM COMPONENTS

import AccountPopover from "./account-popover";
import NotificationsPopover from "./notification-popover"; // STYLED COMPONENTS

import { StyledInputBase } from "./styles";

const RightContent = () => {
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

  return <FlexBox alignItems="center" gap={2}>
      {/* Console button hidden when already in dashboard */}
      {/* <Button
        variant="outlined"
        size="small"
        startIcon={<TerminalIcon />}
        onClick={handleConsoleClick}
        sx={{
          borderColor: 'grey.400',
          color: 'grey.700',
          '&:hover': {
            borderColor: 'grey.600',
            backgroundColor: 'grey.50'
          }
        }}
      >
        Console
      </Button> */}

      <StyledInputBase placeholder="Search anything..." startAdornment={<Search sx={{
      color: "grey.500"
    }} />} />

      {/* <NotificationsPopover />
      <AccountPopover /> */}
    </FlexBox>;
};

export default RightContent;