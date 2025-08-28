'use client'
import Link from 'next/link';
import Image from 'next/image';
import type { ProtocolSummary } from '@/types';

interface UnifiedCardProps {
  protocol: ProtocolSummary;
  variant?: 'product' | 'protocol';
  isCenter?: boolean;
}

export default function UnifiedCard({ protocol, variant = 'protocol', isCenter = false }: UnifiedCardProps) {

  if (variant === 'product') {
    return (
      <div 
        className={`bg-gray-100 rounded-[20px] border border-white overflow-hidden relative w-[600px] h-[400px] transition-all duration-300 ${
          isCenter 
            ? 'shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]' 
            : 'shadow-[0_0_20px_rgba(255,255,255,0.5)]'
        }`}
        role="article"
        aria-labelledby={`protocol-${protocol.slug}-title`}
      >
        {/* Header Section - Title */}
        <div className="absolute top-[var(--card-padding)] left-[var(--card-padding)] right-[var(--card-padding)] z-10">
          <h3 id={`protocol-${protocol.slug}-title`} className="text-2xl font-light text-[rgb(var(--color-horizon-gray))] font-inter">
            {protocol.name}
          </h3>
        </div>

        {/* TLDR Description */}
        <div className="absolute top-[calc(var(--card-padding)+var(--card-section-gap)+2rem)] left-[var(--card-padding)] right-[var(--card-padding)] z-10">
          <p className="text-base font-medium text-[rgb(var(--color-horizon-gray-light))] leading-relaxed font-inter italic">
            Powering incentives to build solar infrastructure through Bitcoin-style tokenomics.
          </p>
        </div>

        {/* Image Section */}
        <div className="absolute top-[calc(var(--card-padding)+var(--card-section-gap)*2+4rem+8px+3px)] left-[var(--card-padding)] right-[var(--card-padding)] bottom-[calc(var(--card-padding)+var(--card-section-gap)*2+4rem)]">
          <div 
            className="w-full rounded-lg overflow-hidden aspect-[3/1]"
          >
            <Image
              src="/images/GlowBanner.png"
              alt="Glow Protocol Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Footer Section - Infrastructure */}
        <div className="absolute bottom-[calc(var(--card-padding)+var(--card-section-gap)+2rem-10px-4px)] left-[var(--card-padding)] right-[var(--card-padding)] text-right">
          <p className="text-sm text-gray-700">
            Decentralized infrastructure, {Array.isArray(protocol.chains) ? protocol.chains[0] : protocol.chains}
          </p>
        </div>

        {/* Metrics Section - Investment/Growth */}
        <div className="absolute bottom-[var(--card-padding)] left-[var(--card-padding)] right-[var(--card-padding)]">
          <div className="flex justify-end gap-2 text-sm">
            <span className="text-green-600 font-medium">
              Investment Opportunity: {protocol.radarRating ? (protocol.radarRating / 10).toFixed(1) : '7.8'}
            </span>
            <span className="text-black font-medium">&#47;&#47;</span>
            <span className="text-green-600 font-medium">
              Growth Potential: {protocol.growthPotential ? '9.9' : '9.9'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Protocol variant (simple list view)
  return (
    <Link href={`/protocols/${protocol.slug}`} className="min-w-[260px] card hover:shadow transition">
      <div className="text-sm text-gray-500">{protocol.category.join(', ')}</div>
      <div className="text-lg font-semibold">{protocol.name}{protocol.ticker ? ` (${protocol.ticker})` : ''}</div>
      <div className="text-xs mt-1">{Array.isArray(protocol.chains) ? protocol.chains.join(', ') : protocol.chains}</div>
      <div className="text-xs mt-2 text-gray-500">Updated {protocol.lastUpdated ?? '—'}</div>
    </Link>
  );
}
