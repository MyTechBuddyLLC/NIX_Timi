// src/views/EventForm.tsx
import React from 'react';
import type { Event } from 'react-big-calendar';
import './EventForm.css';

interface EventFormProps {
  event: Event | null; // null for a new event
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onCancel }) => {
  return (
    <div className="event-form-container">
      <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
      <form>
        <div className="form-group">
          <label htmlFor="displayText">Display Text</label>
          <input
            type="text"
            id="displayText"
            defaultValue={String(event?.title || '')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            defaultValue={event?.start ? event.start.toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            defaultValue={event?.end ? event.end.toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            defaultValue={''} // Assuming description is not in mock Event type
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category">
            {/* Placeholder categories */}
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="appointment">Appointment</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="button-primary">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
