'use client'
import Link from 'next/link';
import type { ProtocolSummary } from '@/types';
import { Icons } from '@/components/ui/Icons';

interface UnifiedCardProps {
  protocol: ProtocolSummary;
  variant?: 'product' | 'protocol';
  isCenter?: boolean;
}

export default function UnifiedCard({ protocol, variant = 'protocol', isCenter = false }: UnifiedCardProps) {
  const handleCopyTicker = async () => {
    if (protocol.ticker && variant === 'product') {
      try {
        await navigator.clipboard.writeText(protocol.ticker);
        if (window.showToast) {
          window.showToast(`${protocol.ticker} contract address copied to your clipboard.`, 'success');
        }
      } catch {
        console.error('Failed to copy ticker');
      }
    }
  };

  if (variant === 'product') {
    return (
      <div 
        className={`bg-gray-100 rounded-[20px] border border-white overflow-hidden relative w-[600px] h-[480px] transition-all duration-300 ${
          isCenter 
            ? 'shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]' 
            : 'shadow-[0_0_20px_rgba(255,255,255,0.5)]'
        }`}
        role="article"
        aria-labelledby={`protocol-${protocol.slug}-title`}
      >
        {/* Header Section */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <h3 id={`protocol-${protocol.slug}-title`} className="text-2xl font-light text-[rgb(var(--color-horizon-gray))] font-inter">
            {protocol.name}
          </h3>
          <div className="flex items-center gap-2">
            {protocol.ticker && (
              <>
                <button
                  onClick={handleCopyTicker}
                  className="w-4 h-4 text-[rgb(var(--color-horizon-gray))] hover:text-[rgb(var(--color-horizon-gray))/80] transition-colors"
                  aria-label="Copy ticker to clipboard"
                >
                  <Icons.Copy />
                </button>
                <span className="text-base font-medium text-[rgb(var(--color-horizon-gray))] font-inter">
                  ${protocol.ticker}
                </span>
              </>
            )}
          </div>
        </div>

        {/* TLDR Description */}
        <div className="absolute top-14 left-4 right-4 z-10">
          <p className="text-base font-medium text-[rgb(var(--color-horizon-gray-light))] leading-relaxed font-inter italic">
            Powering incentives to build solar infrastructure through Bitcoin-style tokenomics.
          </p>
        </div>

        {/* Image Section */}
        <div className="absolute top-28 left-4 right-4 bottom-16">
          <div 
            className="w-full rounded-lg overflow-hidden"
            style={{ aspectRatio: '3/1' }}
          >
            <img
              src="/images/GlowBanner.png"
              alt="Glow Protocol Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="absolute bottom-12 left-4 right-4 text-right">
          <p className="text-sm text-gray-700">
            Decentralized infrastructure, {Array.isArray(protocol.chains) ? protocol.chains[0] : protocol.chains}
          </p>
        </div>

        {/* Metrics Section */}
        <div className="absolute bottom-4 left-4 right-4">
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
