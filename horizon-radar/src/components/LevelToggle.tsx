'use client'

import { useLevel } from '@/contexts/LevelContext'
import type { ReadingLevel } from '@/types'

const levels: ReadingLevel[] = ['novice', 'technical', 'analyst']

export default function LevelToggle() {
  const { level, setLevel } = useLevel()
  
  return (
    <div className="border rounded-lg text-sm inline-flex overflow-hidden" role="tablist" aria-label="Reading style">
      {levels.map((l) => (
        <button
          key={l}
          role="tab"
          aria-selected={level === l}
          className={`px-3 py-1 ${level === l ? 'bg-black text-white' : 'bg-white'}`}
          onClick={() => setLevel(l)}
        >
          {l[0].toUpperCase() + l.slice(1)}
        </button>
      ))}
    </div>
  )
}
