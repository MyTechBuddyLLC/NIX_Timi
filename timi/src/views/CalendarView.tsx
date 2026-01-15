// src/views/CalendarView.tsx
import React from 'react';
import SmartCanvasCell from '../SmartCanvasCell';

const CalendarView: React.FC = () => {
  // Mock data for the SmartCanvasCell component, matching the component's props
  const mockCellData = {
    displayText: 'Project Deadline',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', // A relevant placeholder image
    displayConfig: {
      mode: 'Smart Overlay' as const,
    },
  };

  return (
    <div id="smart-canvas-container">
      <SmartCanvasCell
        displayText={mockCellData.displayText}
        imageUrl={mockCellData.imageUrl}
        displayConfig={mockCellData.displayConfig}
      />
    </div>
  );
};

export default CalendarView;
