// src/views/CalendarView.tsx
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Event, View as CalendarViewType } from 'react-big-calendar';
import CalendarToolbar from './CalendarToolbar'; // Import the custom toolbar
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
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

// Mock event data
const mockEvents = [
  {
    title: 'Project Kickoff',
    start: new Date(2024, 6, 10, 10, 0, 0), // Note: Month is 0-indexed (6 = July)
    end: new Date(2024, 6, 10, 12, 0, 0),
  },
  {
    title: 'Design Review',
    start: new Date(2024, 6, 15, 14, 0, 0),
    end: new Date(2024, 6, 15, 15, 30, 0),
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
  setCurrentView: (view: View) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ setCurrentView }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');

  const handleSelectEvent = (event: object) => {
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
      />
    </div>
  );
};

export default CalendarView;
