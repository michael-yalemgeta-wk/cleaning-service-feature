"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isOwner = localStorage.getItem("isOwner");
    if (!isOwner) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="owner" />
      <div style={{ flexGrow: 1, background: 'var(--background)' }}>
        {children}
      </div>
    </div>
  );
}
