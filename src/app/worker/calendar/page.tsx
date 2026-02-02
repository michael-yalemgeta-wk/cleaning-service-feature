"use client";

import { useEffect, useState } from "react";
import WorkCalendar from "@/components/WorkCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export default function WorkerCalendarPage() {
  const [workerId, setWorkerId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("workerId");
    setWorkerId(id);
  }, []);

  if (!workerId) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <CalendarIcon /> My Schedule
      </h1>
      <p className="text-muted mb-md">Your assigned jobs and tasks.</p>
      <WorkCalendar role="worker" staffId={workerId} />
    </div>
  );
}
