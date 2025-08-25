'use client'

import { useLevel } from '@/contexts/LevelContext'
import type { SectionCopy } from '@/types'

export default function CopyByLevel({ copy }: { copy?: SectionCopy }) {
  const { level } = useLevel()
  
  return <p className="text-sm text-gray-700">{copy?.[level] ?? '—'}</p>
}
