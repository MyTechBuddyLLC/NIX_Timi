// src/hooks/useVersionCheck.ts
import { useState, useEffect } from 'react';

// Assume the current version is stored in package.json and exposed via Vite's env
const CURRENT_VERSION = import.meta.env.PACKAGE_VERSION;

export const useVersionCheck = (checkInterval: number = 1000 * 60 * 60) => { // Default: 1 hour
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Fetch with a cache-busting query parameter to ensure we get the latest file
        const response = await fetch('/version.json?t=' + new Date().getTime());
        if (!response.ok) {
          throw new Error('Failed to fetch version.json');
        }
        const data = await response.json();
        const latestVersion = data.version;

        // A simple version comparison
        if (latestVersion > CURRENT_VERSION) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check immediately on mount, then set up the interval
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, checkInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [checkInterval]);

  return { isUpdateAvailable };
};
