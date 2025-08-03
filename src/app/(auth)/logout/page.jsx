"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { H6 } from "components/Typography";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Logout functionality is disabled
    console.log("Logout is disabled");
  }, []);

  return (
    <div style={{textAlign: 'center', padding: '2rem'}}>
      <h6>Logout is temporarily disabled</h6>
      <p style={{color: '#666', marginTop: '1rem'}}>Please contact support if you need assistance.</p>
    </div>
  );
}