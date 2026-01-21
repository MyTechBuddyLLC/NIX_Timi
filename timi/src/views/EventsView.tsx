// src/views/EventsView.tsx
import React from 'react';
import type { Event } from 'react-big-calendar';
import EventForm from './EventForm';
import './EventsView.css';

// Re-using the mock data from CalendarView for now
const mockEvents = [
  { title: 'Project Kickoff', start: new Date(2024, 6, 10), end: new Date(2024, 6, 10), allDay: true },
  { title: 'Design Review', start: new Date(2024, 6, 15), end: new Date(2024, 6, 15), allDay: true },
  { title: 'Development Sprint End', start: new Date(2024, 6, 25), end: new Date(2024, 6, 25), allDay: true },
];

interface EventsViewProps {
  editingEvent: Event | null | undefined;
  onEditEvent: (event: Event | null) => void;
  onCancel: () => void;
}

const EventsView: React.FC<EventsViewProps> = ({ editingEvent, onEditEvent, onCancel }) => {
  // If editingEvent is either an object (for editing) or null (for creating), show the form.
  // Otherwise (if it's undefined), show the list of events.
  if (editingEvent !== undefined) {
    return <EventForm event={editingEvent} onCancel={onCancel} />;
  }

  return (
    <div className="events-view-container">
      <div className="events-header">
        <h1>Events</h1>
        <button className="new-event-btn" onClick={() => onEditEvent(null)}>+ New Event</button>
      </div>
      <ul className="events-list">
        {mockEvents.map((event, index) => (
          <li key={index} onClick={() => onEditEvent(event)}>
            <div className="event-title">{event.title}</div>
            <div className="event-date">{event.start.toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsView;
