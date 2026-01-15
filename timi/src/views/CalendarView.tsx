// src/views/CalendarView.tsx
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event } from 'react-big-calendar';
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

// Mock event data for January 2026
const mockEvents = [
  {
    title: 'Project Kickoff',
    start: new Date(2026, 0, 12, 10, 0, 0), // Month is 0-indexed (0 = January)
    end: new Date(2026, 0, 12, 12, 0, 0),
  },
  {
    title: 'Design Review',
    start: new Date(2026, 0, 15, 14, 0, 0),
    end: new Date(2026, 0, 15, 15, 30, 0),
  },
  {
    title: 'Development Sprint End',
    start: new Date(2026, 0, 29),
    end: new Date(2026, 0, 29),
    allDay: true,
  },
];


type View = 'calendar' | 'events' | 'groups' | 'settings';

interface CalendarViewProps {
  setCurrentView: (view: View) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ setCurrentView }) => {
  const handleSelectEvent = (event: Event) => {
    console.log('Event selected:', event); // For debugging
    setCurrentView('events');
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Calendar
        localizer={localizer}
        events={mockEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month']}
        defaultView="month"
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarView;
