'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/about')) return null; // no footer on About per spec

  // Research page gets special styling
  const isResearchPage = pathname === '/research';
  
  return (
    <footer className={`fixed bottom-0 left-0 right-0 w-full z-[1] ${isResearchPage ? 'bg-white' : 'bg-transparent'}`}>
      <div className={`w-full px-8 ${isResearchPage ? 'py-4 text-gray-800' : 'py-7 text-white'} grid grid-cols-3 items-center text-base`}>
        <div><button 
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium transition-colors ${isResearchPage ? 'text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))]' : 'text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))]'}`}
          onClick={() => window.showSubscribePopout()}
        >
          Subscribe
        </button></div>
        <div className="text-center">© HorizonRadar 2025. All rights reserved.</div>
        <div className="text-right space-x-3">
          <Link href="/watchlist" className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium transition-colors ${isResearchPage ? 'text-white bg-white hover:bg-gray-100' : 'text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))]'}`}>
            <Icons.Star className="w-5 h-5 text-white" />
          </Link>
          <Link href="https://x.com/horizonradar" className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium transition-colors ${isResearchPage ? 'text-white bg-white hover:bg-gray-100' : 'text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))]'}`}>
            <img src="/images/WhiteXLogo.png" alt="X (Twitter)" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
