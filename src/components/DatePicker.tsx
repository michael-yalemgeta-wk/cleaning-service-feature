"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  blockedDates?: string[];
  minDate?: string;
}

export default function DatePicker({ value, onChange, blockedDates = [], minDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Initialize month to selected date if present
  useEffect(() => {
    if (value) {
      setCurrentMonth(parseISO(value));
    }
  }, []); // Only on mount

  const onDateClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-md" style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
        <button type="button" onClick={prevMonth} className="btn" style={{ padding: '0.5rem', height: 'auto' }}>
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button type="button" onClick={nextMonth} className="btn" style={{ padding: '0.5rem', height: 'auto' }}>
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eeee";
    const days = [];
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} style={{ width: '14.28%', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }

    return <div className="flex mb-sm">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const minDateObj = minDate ? parseISO(minDate) : new Date();
    // Normalize minDate to start of day for comparison
    minDateObj.setHours(0,0,0,0);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dateString = format(day, 'yyyy-MM-dd');
        
        const isBlocked = blockedDates.includes(dateString);
        const isPast = isBefore(day, minDateObj);
        const isDisabled = isBlocked || (isPast && !isSameDay(day, minDateObj));
        const isSelected = value === dateString;
        const notCurrentMonth = !isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            style={{ width: '14.28%', aspectRatio: '1/1', padding: '2px' }}
          >
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onDateClick(cloneDay)}
              className={isSelected ? "btn-primary" : ""}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: 'none',
                background: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'white' : isDisabled ? 'var(--text-muted)' : 'var(--text-main)',
                opacity: isDisabled || notCurrentMonth ? 0.4 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontWeight: isSelected ? 'bold' : 'normal',
                fontSize: '0.9rem',
                textDecoration: isBlocked ? 'line-through' : 'none'
              }}
            >
              {formattedDate}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="card" style={{ padding: '1rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.3, textDecoration: 'line-through' }}></div>
          <span>Blocked/Past</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
