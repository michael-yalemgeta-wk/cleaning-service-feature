"use client";

import WorkCalendar from "@/components/WorkCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export default function AdminCalendarPage() {
  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <CalendarIcon /> Work Calendar
      </h1>
      <p className="text-muted mb-md">View and manage all bookings across all staff members.</p>
      <WorkCalendar role="admin" />
    </div>
  );
}
