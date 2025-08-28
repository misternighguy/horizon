import { notFound } from 'next/navigation'
import { mockProtocols } from '@/data/mock'
import LevelToggle from '@/components/LevelToggle'
import CopyByLevel from '@/components/CopyByLevel'

function Section({
  title,
  copy,
}: {
  title: string
  copy?: { novice?: string; technical?: string; analyst?: string }
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <CopyByLevel copy={copy} />
    </section>
  )
}

export default function ProtocolPage({ params }: { params: { slug: string } }) {
  const p = mockProtocols[params.slug]
  if (!p) return notFound()
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold">
            {p.name}
            {p.ticker ? ` (${p.ticker})` : ''}
          </div>
          <div className="text-sm text-gray-500">
            {p.category.join(' · ')} · {(Array.isArray(p.chains) ? p.chains.join(', ') : p.chains) || 'Web App'}
          </div>
        </div>
        <LevelToggle />
      </div>

      <Section title="Abstract" copy={p.sections?.abstract} />
      <Section title="Products & Architecture" copy={p.sections?.architecture} />
      <Section title="Core Mechanics: Deposit" copy={p.sections?.mechanics?.deposit} />
      <Section title="Core Mechanics: Withdraw" copy={p.sections?.mechanics?.withdraw} />
      <Section title="Core Mechanics: Incentives" copy={p.sections?.mechanics?.incentives} />
      <Section title="Problem" copy={p.sections?.problemUsersValue?.problem} />
      <Section title="Users" copy={p.sections?.problemUsersValue?.users} />
      <Section title="Value Proposition" copy={p.sections?.problemUsersValue?.value} />
      <Section title="Tokenomics" copy={p.sections?.tokenomics} />
      <Section title="Author & Sources" copy={p.sections?.authorSources} />
      <Section title="Disclaimer" copy={p.sections?.disclaimer} />
      <Section title="Community" copy={p.sections?.community} />
    </div>
  )
}
