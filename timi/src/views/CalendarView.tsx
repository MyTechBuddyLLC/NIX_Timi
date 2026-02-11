// src/views/CalendarView.tsx
import React, { useState } from 'react';
import type { Event, View as CalendarViewType } from 'react-big-calendar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import CalendarToolbar from './CalendarToolbar'; // Import the custom toolbar
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  events: Event[];
  onEditEvent: (event: Event | null) => void;
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  date: Date;
  onDateChange: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEditEvent,
  view,
  onViewChange,
  date,
  onDateChange,
}) => {
  const handleSelectEvent = (event: Event) => {
    onEditEvent(event);
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['day', 'week', 'month', 'agenda']}
        view={view}
        date={date}
        onView={onViewChange}
        onNavigate={onDateChange}
        onSelectEvent={handleSelectEvent}
        components={{
          toolbar: CalendarToolbar,
        }}
        length={view === 'agenda' ? 2 : 30}
        formats={{
          timeGutterFormat: () => '', // Hides the time gutter by returning an empty string
        }}
      />
    </div>
  );
};

export default CalendarView;
