import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view"; // API FUNCTIONS
import { SystemsPageView } from "pages-sections/vendor-dashboard/systems/page-view";
import { DashboardPageView } from "pages-sections/vendor-dashboard/dashboard/page-view";
import { cookies } from "next/headers";
import { USER_LOCAL_ID } from "utils/cookies-utils";

import { getCookie, UID } from 'utils/cookies-utils';

import { VendorDashboardLayout } from "components/layouts/vendor-dashboard";

export const metadata = {
  title: "Dashboard - NCTR",
  description: `NCTR provides secure and easy-to-integrate identity verification solutions, including NFC, OCR, and QR code authentication, designed for web and mobile apps.`,
  authors: [{
    name: "NCTR",
    url: "https://nctr.sd"
  }],
  //viewport: "width=device-width, initial-scale=1",
  keywords: ["Identity verification", "NFC verification", "OCR document scanning", "QR code authentication", "Middle East", "Africa", "Mobile SDKs", "Secure identity validation", "e-passports", "identity solutions", "remote verification", "KYC", "AML", "GDPR","Face Recognition"]
};
export default async function Products() {
  return <VendorDashboardLayout><DashboardPageView /></VendorDashboardLayout>;
}