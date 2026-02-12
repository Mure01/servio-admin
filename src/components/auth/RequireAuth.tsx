"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isLoading, refresh, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace(`/signin?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    // Optionally verify token
    refresh();
  }, [token, isLoading]);

  // if admin is required, you can enforce it here
 

  if (isLoading) return null;
  if (!token) return null;
  return <>{children}</>;
}
