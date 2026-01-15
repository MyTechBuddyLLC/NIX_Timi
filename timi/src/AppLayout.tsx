// src/AppLayout.tsx
import React, { useState } from 'react';
import './AppLayout.css';
import CalendarView from './views/CalendarView';
import EventsView from './views/EventsView';
import GroupsView from './views/GroupsView';
import SettingsView from './views/SettingsView';
import { useVersionCheck } from './hooks/useVersionCheck';

type View = 'calendar' | 'events' | 'groups' | 'settings';

const UpdateNotification: React.FC = () => (
  <div className="updateNotification">
    A new version is available. Please refresh the page.
    <button onClick={() => window.location.reload()}>Refresh</button>
  </div>
);

type NavLinksProps = {
  currentView: View;
  setCurrentView: (view: View) => void;
};

const NavLinks: React.FC<NavLinksProps> = ({ currentView, setCurrentView }) => (
  <>
    <a
      href="#calendar"
      className={`navItem ${currentView === 'calendar' ? 'active' : ''}`}
      onClick={() => setCurrentView('calendar')}
    >
      Calendar
    </a>
    <a
      href="#events"
      className={`navItem ${currentView === 'events' ? 'active' : ''}`}
      onClick={() => setCurrentView('events')}
    >
      Events
    </a>
    <a
      href="#groups"
      className={`navItem ${currentView === 'groups' ? 'active' : ''}`}
      onClick={() => setCurrentView('groups')}
    >
      Groups
    </a>
    <a
      href="#settings"
      className={`navItem ${currentView === 'settings' ? 'active' : ''}`}
      onClick={() => setCurrentView('settings')}
    >
      Settings
    </a>
  </>
);

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('calendar');
  const { isUpdateAvailable } = useVersionCheck();

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView setCurrentView={setCurrentView} />;
      case 'events':
        return <EventsView />;
      case 'groups':
        return <GroupsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CalendarView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className={`appLayout ${isUpdateAvailable ? 'update-visible' : ''}`}>
      {isUpdateAvailable && <UpdateNotification />}

      <div className="contentWrapper">
        {/* Sidebar for Desktop */}
        <nav className="sidebar">
          <NavLinks currentView={currentView} setCurrentView={setCurrentView} />
        </nav>

        {/* Main Content Area */}
        <main className="mainContent">
          {renderView()}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottomNav">
        <NavLinks currentView={currentView} setCurrentView={setCurrentView} />
      </nav>
    </div>
  );
};

export default AppLayout;
