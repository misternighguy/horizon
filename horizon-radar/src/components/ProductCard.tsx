'use client'
import type { ProtocolSummary } from '@/types'
// import { UI_CONSTANTS } from '@/constants/ui'

interface ProductCardProps {
  protocol: ProtocolSummary
  isCenter?: boolean
}

export default function ProductCard({ protocol, isCenter = false }: ProductCardProps) {

  const handleCopyTicker = async () => {
    if (protocol.ticker) {
      try {
        await navigator.clipboard.writeText(protocol.ticker)
        // Use toast system instead of local state
        if (window.showToast) {
          window.showToast(`${protocol.ticker} contract address copied to your clipboard.`, 'success');
        }
      } catch {
        console.error('Failed to copy ticker')
      }
    }
  }

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
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
        <div className="w-full h-[65%] bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">☀️</div>
            <div className="text-sm opacity-80">Solar Infrastructure</div>
          </div>
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
  )
}
