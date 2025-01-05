import { LoginPageView } from "pages-sections/sessions/page-view";
import { PrivacyPageView } from "pages-sections/privacy/page-view";
import { ShopLayout2 } from "components/layouts/shop-layout-2";
export const metadata = {
  title: "Privacy - Green Chains",
  description: `Unlock hidden carbon credits from your green project`,
  authors: [{
    name: "Green chains",
    url: "https://greenchains.net"
  }],
  //viewport: "width=device-width, initial-scale=1",
  keywords: ["carbon credit", "green", "solar", "climate change"]
};
export default function Privacy() {
  return <ShopLayout2><PrivacyPageView /></ShopLayout2>;
}