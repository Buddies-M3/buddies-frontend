"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { H6 } from "components/Typography";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('/api-keys/login/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: null
        });

        if (response.ok) {
          // Logout successful, redirect to the login page or home page
          router.push("/login");
        } else {
          // Handle errors
          console.error("Failed to logout");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    logout();
  }, []);

  return <h6 style={{textAlign: 'center'}}>Logging out</h6>;
}