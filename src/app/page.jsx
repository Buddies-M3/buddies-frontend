
import IndexPageView from "pages-sections/landing/page-view";
import { ShopLayout2 } from "components/layouts/shop-layout-2";
import productDatabase from "data/product-database";
import Hero from "front-page/components/Hero";
import Feature from "front-page/components/Features";
import About from "front-page/components/About";
import CTA from "front-page/components/CTA";
import Testimonial from "front-page/components/Testimonial";
import FAQ from "front-page/components/FAQ";
import Contact from "front-page/components/Contact";


import api from "utils/__api__/grocery-2";
import Integration from "front-page/components/Integration";
import FeaturesTab from "front-page/components/FeaturesTab";

export const metadata = {
  title: "IDENA - Trusted Identity Verification Solutions",
  description: `IDENA provides secure and easy-to-integrate identity verification solutions, including NFC, OCR, and QR code authentication, designed for web and mobile apps.`,
  authors: [{
    name: "IDENA",
    url: "https://idena.net"
  }],
  //viewport: "width=device-width, initial-scale=1",
  keywords: ["Identity verification", "NFC verification", "OCR document scanning", "QR code authentication", "Middle East", "Africa", "Mobile SDKs", "Secure identity validation", "e-passports", "identity solutions", "remote verification", "KYC", "AML", "GDPR","Face Recognition"]
};
export default async function IndexPage() {
  return (<ShopLayout2>
    <Hero />
    <FeaturesTab />
    <Feature />
    <Contact />
    <CTA />
    <FAQ />
  </ShopLayout2>);
}