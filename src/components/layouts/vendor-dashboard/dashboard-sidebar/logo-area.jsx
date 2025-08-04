import Avatar from "@mui/material/Avatar"; // GLOBAL CUSTOM COMPONENT

import FlexBetween from "components/flex-box/flex-between"; // LOCAL CUSTOM HOOK

import { useLayout } from "../dashboard-layout-context"; // STYLED COMPONENT

import { ChevronLeftIcon } from "./styles";
import { H3 } from "components/Typography";

const LogoArea = () => {
  const {
    TOP_HEADER_AREA,
    COMPACT,
    sidebarCompact,
    handleSidebarCompactToggle
  } = useLayout();
  return <FlexBetween p={2} maxHeight={TOP_HEADER_AREA} justifyContent={COMPACT ? "center" : "space-between"}>
      <Avatar alt="NCTR Logo" src={COMPACT ? "/assets/images/logos/nctr-logo.png" : "/assets/images/logos/nctr-logo.png"} sx={{
      borderRadius: 0,
      width: "auto",
      marginLeft: COMPACT ? 0 : 1
    }} /> 
    {/* {COMPACT ? null : <H3>NCTR</H3>} */}

      <ChevronLeftIcon color="disabled" compact={COMPACT} onClick={handleSidebarCompactToggle} sidebar_compact={sidebarCompact ? 1 : 0} />
    </FlexBetween>;
};

export default LogoArea;