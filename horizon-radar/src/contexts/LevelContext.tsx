'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReadingLevel } from '../types'

const LevelContext = createContext<{ level: ReadingLevel; setLevel: (l: ReadingLevel) => void }>({
  level: 'beginner',
  setLevel: () => {},
})

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<ReadingLevel>('beginner')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hr_level')
      if (saved && ['beginner', 'intermediate', 'advanced'].includes(saved)) {
        setLevel(saved as ReadingLevel)
      }
    }
  }, [])
  
  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('hr_level', level)
  }, [level])
  
  return <LevelContext.Provider value={{ level, setLevel }}>{children}</LevelContext.Provider>
}

export const useLevel = () => useContext(LevelContext)
