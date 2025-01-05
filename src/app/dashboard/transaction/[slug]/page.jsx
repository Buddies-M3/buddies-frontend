"use client";
import { useParams } from 'next/navigation'
import { SystemCreatePageView } from "pages-sections/vendor-dashboard/systems/page-view";
import { VendorDashboardLayout } from "components/layouts/vendor-dashboard";
import { TransactionPageView } from "pages-sections/vendor-dashboard/transactions/page-view";

export default function Transaction({params}) {
    const { slug } = useParams();
    return <VendorDashboardLayout><TransactionPageView transactionId={slug} /></VendorDashboardLayout>;
}