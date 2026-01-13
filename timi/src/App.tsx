// src/App.tsx
import SmartCanvasCell from './SmartCanvasCell';
import './App.css';

// Sample data to make the app runnable
const sampleProps = {
  displayText: 'Joshua Sorenson - 1984 - Birth',
  // Using the local placeholder image
  imageUrl: '/placeholder.svg',
  displayConfig: {
    mode: 'Smart Overlay' as const,
  },
};

function App() {
  return (
    <div className="App">
      <h1>Tími</h1>
      <p>A Local-First Calendar Architect</p>
      <hr />
      <h2>Component Example: SmartCanvasCell</h2>
      <SmartCanvasCell {...sampleProps} />
    </div>
  );
}

export default App;
