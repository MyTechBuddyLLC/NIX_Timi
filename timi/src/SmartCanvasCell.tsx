// SmartCanvasCell.tsx
import React from 'react';
import './SmartCanvasCell.css';

interface SmartCanvasCellProps {
  /** The text to display for the event */
  displayText: string;
  /** The URL of the background image for the cell */
  imageUrl: string;
  /** The visual configuration for the cell */
  displayConfig: {
    mode: 'Smart Overlay' | 'Stacked Above' | 'Stacked Below';
    // Future properties like custom colors, fonts, etc. can be added here
  };
}

const SmartCanvasCell: React.FC<SmartCanvasCellProps> = ({
  displayText,
  imageUrl,
  displayConfig,
}) => {
  // For this initial skeleton, we are only implementing the "Smart Overlay" mode.
  if (displayConfig.mode !== 'Smart Overlay') {
    // In a full implementation, we would render other modes here.
    return null;
  }

  // Style for the background image
  const cellStyle = {
    backgroundImage: `url(${imageUrl})`,
  };

  return (
    <div
      className="canvasCell smartOverlay"
      style={cellStyle}
    >
      <div className="overlayContent">
        <h2 className="eventTitle">{displayText}</h2>
        {/* In a real component, date might be a separate prop */}
        <p className="eventDate">Example Date: 2024-01-13</p>
      </div>
    </div>
  );
};

export default SmartCanvasCell;
