'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReadingLevel } from '../types'

const LevelContext = createContext<{ level: ReadingLevel; setLevel: (l: ReadingLevel) => void }>({
  level: 'novice',
  setLevel: () => {},
})

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<ReadingLevel>('novice')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First try to get user's preferred reading level from database
      const localStorageDB = window.localStorageDB;
      const username = localStorage.getItem('userSession') || localStorage.getItem('adminSession');
      
      if (localStorageDB && username) {
        const userData = localStorageDB.getUserByUsername(username);
        if (userData?.preferences?.readingLevel) {
          setLevel(userData.preferences.readingLevel);
          return;
        }
      }
      
      // Fallback to localStorage if no user preference found
      const saved = window.localStorage.getItem('hr_level')
      if (saved && ['novice', 'technical', 'analyst'].includes(saved)) {
        setLevel(saved as ReadingLevel)
      }
    }
  }, [])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to localStorage for fallback
      window.localStorage.setItem('hr_level', level)
      
      // Also update user's database preferences if logged in
      const localStorageDB = window.localStorageDB;
      const username = localStorage.getItem('userSession') || localStorage.getItem('adminSession');
      
      if (localStorageDB && username) {
        const userData = localStorageDB.getUserByUsername(username);
        if (userData) {
          localStorageDB.updateUser(userData.id, {
            preferences: {
              readingLevel: level,
              notifications: userData.preferences?.notifications ?? true,
              newsletter: userData.preferences?.newsletter ?? true
            }
          });
        }
      }
    }
  }, [level])
  
  return <LevelContext.Provider value={{ level, setLevel }}>{children}</LevelContext.Provider>
}

export const useLevel = () => useContext(LevelContext)
