// src/views/EventsView.tsx
import React from 'react';
import type { Event } from 'react-big-calendar';
import EventForm from './EventForm';
import './EventsView.css';

interface EventsViewProps {
  events: Event[];
  editingEvent: Event | null | undefined;
  onEditEvent: (event: Event | null) => void;
  onCancel: () => void;
  onSave: (event: Event) => void;
}

const EventsView: React.FC<EventsViewProps> = ({ events, editingEvent, onEditEvent, onCancel, onSave }) => {
  // If editingEvent is either an object (for editing) or null (for creating), show the form.
  // Otherwise (if it's undefined), show the list of events.
  if (editingEvent !== undefined) {
    return <EventForm event={editingEvent} onCancel={onCancel} onSave={onSave} />;
  }

  return (
    <div className="events-view-container">
      <div className="events-header">
        <h1>Events</h1>
        <button className="new-event-btn" onClick={() => onEditEvent(null)}>+ New Event</button>
      </div>
      <ul className="events-list">
        {events.map((event, index) => (
          <li key={index} onClick={() => onEditEvent(event)}>
            <div className="event-title">{event.title}</div>
            <div className="event-date">{event.start ? new Date(event.start).toLocaleDateString() : 'No date'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsView;
