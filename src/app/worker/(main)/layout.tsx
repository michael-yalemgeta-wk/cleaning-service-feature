"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      router.push("/worker/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="worker" />
      <div style={{ flexGrow: 1, background: 'var(--background)' }}>
        {children}
      </div>
    </div>
  );
}
