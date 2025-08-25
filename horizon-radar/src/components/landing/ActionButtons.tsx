import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

/**
 * Interactive "glass" buttons with glow ring + diagonal shine on hover.
 * Placed under the product cards on the landing page.
 */

export default function ActionButtons() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-13 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
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
      className="group fancy-btn inline-flex items-center gap-3 rounded-full px-10 py-4 text-[20px] font-light tracking-[-0.01em] bg-white/71 border border-white font-inter"
    >
      <span className="text-white group-hover:text-black transition-colors duration-300">{icon}</span>
      <span className="text-white group-hover:text-[#3c3c3c] transition-colors duration-300">{label}</span>
      <span aria-hidden className="shine" />
    </Link>
  );
}


