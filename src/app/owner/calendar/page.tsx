"use client";

import WorkCalendar from "@/components/WorkCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export default function OwnerCalendarPage() {
  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <CalendarIcon /> Business Calendar
      </h1>
      <p className="text-muted mb-md">Overview of all scheduled services and bookings.</p>
      <WorkCalendar role="owner" />
    </div>
  );
}
