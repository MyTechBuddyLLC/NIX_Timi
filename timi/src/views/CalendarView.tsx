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

// Mock event data for all-day events
const mockEvents = [
  {
    title: 'Project Kickoff',
    start: new Date(2024, 6, 10),
    end: new Date(2024, 6, 10),
    allDay: true,
  },
  {
    title: 'Design Review',
    start: new Date(2024, 6, 15),
    end: new Date(2024, 6, 15),
    allDay: true,
  },
  {
    title: 'Development Sprint End',
    start: new Date(2024, 6, 25),
    end: new Date(2024, 6, 25),
    allDay: true,
  },
];


type View = 'calendar' | 'events' | 'groups' | 'settings';

interface CalendarViewProps {
  onEditEvent: (event: Event | null) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onEditEvent }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');

  const handleSelectEvent = (event: Event) => {
    onEditEvent(event);
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <Calendar
        localizer={localizer}
        events={mockEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['day', 'week', 'month', 'agenda']}
        view={view}
        date={date}
        onView={setView}
        onNavigate={setDate}
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
