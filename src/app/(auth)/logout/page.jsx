"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { H6 } from "components/Typography";
import { removeCookie, USER_TOKEN, UID, USER_LOCAL_ID } from "utils/cookies-utils";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear authentication cookies
    removeCookie(USER_TOKEN);
    removeCookie(UID);
    removeCookie(USER_LOCAL_ID);
    
    console.log("User logged out successfully");
    
    // Redirect to login page
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }, [router]);

  return (
    <div style={{textAlign: 'center', padding: '2rem'}}>
      <H6>Logging you out...</H6>
      <p style={{color: '#666', marginTop: '1rem'}}>Please wait while we securely log you out.</p>
    </div>
  );
}