// src/mockData.ts
import type { Event } from 'react-big-calendar';

export const initialMockEvents: Event[] = [
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
