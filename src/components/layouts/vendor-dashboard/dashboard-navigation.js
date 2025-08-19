import duotone from "icons/duotone";
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PaymentIcon from '@mui/icons-material/Payment';
import ExternalLinkIcon from '@mui/icons-material/OpenInNew';  
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export const navigation = [{
  type: "label",
  label: "Admin"
}, {
  name: "Dashboard",
  icon: duotone.Dashboard,
  path: "/vendor/dashboard"
}, {
  name: "Products",
  icon: duotone.Products,
  children: [{
    name: "Product List",
    path: "/admin/products"
  }, {
    name: "Create Product",
    path: "/admin/products/create"
  }, {
    name: "Product Reviews",
    path: "/admin/products/reviews"
  }]
}, {
  name: "Categories",
  icon: duotone.Accounts,
  children: [{
    name: "Category List",
    path: "/admin/categories"
  }, {
    name: "Create Category",
    path: "/admin/categories/create"
  }]
}, {
  name: "Brands",
  icon: duotone.Apps,
  children: [{
    name: "Brand List",
    path: "/admin/brands"
  }, {
    name: "Create Brand",
    path: "/admin/brands/create"
  }]
}, {
  name: "Orders",
  icon: duotone.Order,
  children: [{
    name: "Order List",
    path: "/admin/orders"
  }, {
    name: "Order Details",
    path: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
  }]
}, {
  name: "Customers",
  icon: duotone.Customers,
  path: "/admin/customers"
}, {
  name: "Refunds",
  icon: duotone.Refund,
  children: [{
    name: "Refund Request",
    path: "/admin/refund-request"
  }, {
    name: "Refund Settings",
    path: "/admin/refund-setting"
  }]
}, {
  name: "Sellers",
  icon: duotone.Seller,
  children: [{
    name: "Seller List",
    path: "/admin/sellers"
  }, {
    name: "Seller Package",
    path: "/admin/seller-package"
  }, {
    name: "Package Payments",
    path: "/admin/package-payments"
  }, {
    name: "Earning History",
    path: "/admin/earning-history"
  }, {
    name: "Payouts",
    path: "/admin/payouts"
  }, {
    name: "Payout Request",
    path: "/admin/payout-requests"
  }]
}, {
  type: "label",
  label: "Vendor"
}, {
  name: "Earnings",
  icon: duotone.ProjectChart,
  children: [{
    name: "Earning History",
    path: "/vendor/earning-history"
  }, {
    name: "Payouts",
    path: "/vendor/payouts"
  }, {
    name: "Payout Request",
    path: "/vendor/payout-requests"
  }, {
    name: "Payout Settings",
    path: "/vendor/payout-settings"
  }]
}, {
  name: "Refund Request",
  icon: duotone.Refund,
  path: "/vendor/refund-request"
}, {
  name: "Reviews",
  icon: duotone.Review,
  path: "/vendor/reviews"
}, {
  name: "Shop Setting",
  icon: duotone.SiteSetting,
  path: "/vendor/shop-settings"
}, {
  name: "Support Tickets",
  icon: duotone.ElementHub,
  path: "/vendor/support-tickets"
}, {
  name: "Account Settings",
  icon: duotone.AccountSetting,
  path: "/vendor/account-settings"
}, {
  name: "Site Settings",
  icon: duotone.SiteSetting,
  path: "/vendor/site-settings"
}, {
  name: "Logout",
  icon: duotone.Session,
  path: "/"
}];


export const gcNavigation = [{
  name: "Dashboard",
  icon: BarChartIcon,
  path: "/dashboard"
}, {
  name: "Transactions",
  icon: HistoryIcon,
  path: "/dashboard/transactions"
}, {
  name: "Service",
  icon: VerifiedUserIcon,
  path: "/service"
}, {
  name: (
    <>
      Documentation
      <ExternalLinkIcon style={{ marginLeft: 4, fontSize: 'small' }} />
    </>
  ),
  icon: DescriptionIcon,
  path: "/docs"
}, {
  name: "Logout",
  icon: LogoutIcon,
  path: "/logout"
}];