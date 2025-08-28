'use client';

import { useEffect } from 'react';
import { localStorageDB } from '@/data/localStorageDB';

export default function DatabaseInitializer() {
  useEffect(() => {
    // Make localStorageDB globally accessible for search functionality
    (window as { localStorageDB?: typeof localStorageDB }).localStorageDB = localStorageDB;
    
    // Force database initialization
    localStorageDB.getUsers(); // This will trigger initialization if needed
    
    console.log('🗄️ Horizon Radar Database initialized and accessible globally');
  }, []);

  return null; // This component doesn't render anything
}
