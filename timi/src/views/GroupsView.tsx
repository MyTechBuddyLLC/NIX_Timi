// src/views/GroupsView.tsx
import React from 'react';
import './GroupsView.css';

// Mock data for groups
const mockGroups = [
  { id: 1, name: 'Personal Planning', description: 'Daily tasks, errands, and personal life organization.', eventsCount: 12 },
  { id: 2, name: 'NIX Projects', description: 'Product timelines, sprints, and release schedules for Norse Industries.', eventsCount: 34 },
  { id: 3, name: 'Family Events', description: 'Holidays, birthdays, and school calendars.', eventsCount: 8 },
  { id: 4, name: 'Fitness & Health', description: 'Workout routines, meal prep, and medical appointments.', eventsCount: 5 },
];

const GroupsView: React.FC = () => {
  return (
    <div className="groups-view-container">
      <div className="groups-header">
        <h1>Event Groups</h1>
        <button className="new-group-btn">+ Create Group</button>
      </div>
      
      <div className="groups-grid">
        {mockGroups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-title">{group.name}</div>
            <div className="group-desc">{group.description}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--nyx-nordic-frost)', marginBottom: '16px', fontWeight: 'bold' }}>
              {group.eventsCount} Active Events
            </div>
            <div className="group-actions">
              <button>Edit Styles</button>
              <button>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsView;
