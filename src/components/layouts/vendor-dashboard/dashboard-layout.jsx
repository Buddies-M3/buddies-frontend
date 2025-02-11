"use client";

import Container from "@mui/material/Container"; // LOCAL CUSTOM COMPONENTS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BodyWrapper from "./dashboard-body-wrapper";
import DashboardNavbar from "./dashboard-navbar/dashboard-navbar";
import DashboardSidebar from "./dashboard-sidebar/dashboard-sidebar"; // LOCAL LAYOUT CONTEXT PROVIDER

import { LayoutProvider } from "./dashboard-layout-context";

const VendorDashboardLayout = ({
  children
}) => {
  return <LayoutProvider>
      {
      /* DASHBOARD SIDEBAR NAVIGATION */
    }
      <DashboardSidebar />

      <BodyWrapper>
        {
        /* DASHBOARD HEADER / TOP BAR AREA */
      }
        <DashboardNavbar />

        {
        /* MAIN CONTENT AREA */
      }
        <Container maxWidth="lg">{children}</Container>
        <ToastContainer/>
      </BodyWrapper>
    </LayoutProvider>;
};

export default VendorDashboardLayout;