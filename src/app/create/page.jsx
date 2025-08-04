import { SystemCreatePageView } from "pages-sections/vendor-dashboard/systems/page-view";
import { VendorDashboardLayout } from "components/layouts/vendor-dashboard";

export const metadata = {
  title: "Create API Key - NCTR",
  description: `NCTR provides secure and easy-to-integrate identity verification solutions, including NFC, OCR, and QR code authentication, designed for web and mobile apps.`,
  authors: [{
    name: "NCTR",
    url: "https://nctr.sd"
  }],
  //viewport: "width=device-width, initial-scale=1",
  keywords: ["Identity verification", "NFC verification", "OCR document scanning", "QR code authentication", "Middle East", "Africa", "Mobile SDKs", "Secure identity validation", "e-passports", "identity solutions", "remote verification", "KYC", "AML", "GDPR","Face Recognition"]
};

export default function ProductCreate() {
  return <VendorDashboardLayout><SystemCreatePageView /></VendorDashboardLayout>;
}