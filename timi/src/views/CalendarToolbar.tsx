// src/views/CalendarToolbar.tsx
import React, { useState } from 'react';
import type { View } from 'react-big-calendar';
import { Navigate } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarToolbar.css';

// Define a type for the navigation action based on the Navigate object values
type NavigateAction = 'PREV' | 'NEXT' | 'TODAY' | 'DATE';

interface CalendarToolbarProps {
  date: Date;
  view: View;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
  onView: (view: View) => void;
  label: string;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ date, view, onNavigate, onView, label }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateChange = (newDate: Date | [Date | null, Date | null] | null) => {
    if (newDate && !Array.isArray(newDate)) {
      onNavigate(Navigate.DATE, newDate);
    } else if (Array.isArray(newDate) && newDate[0]) {
      // For range selection in agenda view
      onNavigate(Navigate.DATE, newDate[0]);
    }
    setIsDatePickerOpen(false);
  };

  const renderDatePicker = () => {
    const commonProps = {
      selected: date,
      onChange: handleDateChange,
      inline: true,
    };

    switch (view) {
      case 'week':
        // The 'selectsWeek' prop was causing a type error with the current
        // definitions. A standard day picker is a safe fallback.
        return <DatePicker {...commonProps} />;
      case 'month':
        return <DatePicker {...commonProps} showMonthYearPicker onChange={(d: Date) => handleDateChange(d)} />;
      case 'agenda':
        // For the 2-day agenda view, a simple day picker is most intuitive.
        // The user picks the start day.
      default: // 'day' view
        return <DatePicker {...commonProps} />;
    }
  };

  return (
    <div className="rbc-toolbar">
      <div className="rbc-toolbar-group">
        <button type="button" onClick={() => onNavigate(Navigate.PREVIOUS)}>&lt;</button>
        <button type="button" onClick={() => onNavigate(Navigate.TODAY)}>Today</button>
        <button type="button" onClick={() => onNavigate(Navigate.NEXT)}>&gt;</button>
      </div>

      <div className="rbc-toolbar-label-container">
        <div className="rbc-toolbar-label" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
          {label}
        </div>
        {isDatePickerOpen && (
          <div className="date-picker-modal">
            <div className="date-picker-content">
              {renderDatePicker()}
            </div>
          </div>
        )}
      </div>

      <div className="rbc-toolbar-group">
        <button type="button" className={view === 'day' ? 'rbc-active' : ''} onClick={() => onView('day')}>Day</button>
        <button type="button" className={view === 'week' ? 'rbc-active' : ''} onClick={() => onView('week')}>Week</button>
        <button type="button" className={view === 'month' ? 'rbc-active' : ''} onClick={() => onView('month')}>Month</button>
        <button type="button" className={view === 'agenda' ? 'rbc-active' : ''} onClick={() => onView('agenda')}>Agenda</button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
