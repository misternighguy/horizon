import Link from 'next/link';
import type { ProtocolSummary } from '@/types';

export default function ProtocolCard({ p }: { p: ProtocolSummary }) {
  return (
    <Link href={`/protocols/${p.slug}`} className="min-w-[260px] card hover:shadow transition">
      <div className="text-sm text-gray-500">{p.category.join(', ')}</div>
      <div className="text-lg font-semibold">{p.name}{p.ticker ? ` (${p.ticker})` : ''}</div>
      <div className="text-xs mt-1">{Array.isArray(p.chains) ? p.chains.join(', ') : p.chains}</div>
      <div className="text-xs mt-2 text-gray-500">Updated {p.lastUpdated ?? '—'}</div>
    </Link>
  );
}
