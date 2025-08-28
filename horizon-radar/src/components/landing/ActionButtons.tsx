import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

/**
 * Interactive "glass" buttons with glow ring + diagonal shine on hover.
 * Placed under the product cards on the landing page.
 * Mobile-optimized with responsive layout and touch-friendly sizing.
 * Buttons stack vertically on mobile, horizontally on larger screens.
 * Buttons are constrained in width on mobile for better mobile UX.
 */

export default function ActionButtons() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 md:flex-row md:justify-center w-full">
        <FancyLink
          href="/about"
          ariaLabel="What is Horizon?"
          label="WHAT IS HORIZON?"
          icon={<Icons.Info />}
        />
        <FancyLink
          href="/research"
          ariaLabel="Browse research"
          label="BROWSE RESEARCH"
          icon={<Icons.Grid />}
        />
      </div>
    </div>
  );
}

function FancyLink({
  href,
  label,
  ariaLabel,
  icon,
}: {
  href: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group fancy-btn inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-4 py-3 sm:px-6 md:px-10 sm:py-3 md:py-4 text-base sm:text-lg md:text-[20px] font-light tracking-[-0.01em] bg-white/71 border border-white font-inter whitespace-nowrap w-full max-w-xs sm:w-auto min-h-[44px] sm:min-h-[48px] md:min-h-[56px] transition-all duration-300 hover:bg-white/80 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
    >
      <span className="text-white group-hover:text-black transition-colors duration-300 text-lg sm:text-xl md:text-2xl">{icon}</span>
      <span className="text-white group-hover:text-[#3c3c3c] transition-colors duration-300">{label}</span>
      <span aria-hidden className="shine" />
    </Link>
  );
}


