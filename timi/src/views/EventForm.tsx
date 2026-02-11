// src/views/EventForm.tsx
import React from 'react';
import type { Event } from 'react-big-calendar';
import { format } from 'date-fns/format';
import './EventForm.css';

interface EventFormProps {
  event: Event | null; // null for a new event
  onCancel: () => void;
  onSave: (event: Event) => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onCancel, onSave }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get('displayText') as string;
    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    // const description = formData.get('description') as string;
    // const category = formData.get('category') as string;

    const savedEvent: Event = {
      ...event,
      title,
      start: new Date(startDateStr + 'T00:00:00'),
      end: new Date(endDateStr + 'T00:00:00'),
      allDay: true,
    };

    onSave(savedEvent);
  };

  return (
    <div className="event-form-container">
      <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayText">Display Text</label>
          <input
            type="text"
            id="displayText"
            name="displayText"
            defaultValue={String(event?.title || '')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            defaultValue={event?.start ? format(new Date(event.start), 'yyyy-MM-dd') : ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            defaultValue={event?.end ? format(new Date(event.end), 'yyyy-MM-dd') : ''}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={''} // Assuming description is not in mock Event type
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category">
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
