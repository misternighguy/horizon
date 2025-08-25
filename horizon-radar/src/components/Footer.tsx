'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/about')) return null; // no footer on About per spec

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-transparent w-full z-10">
      <div className="w-full px-8 py-7 grid grid-cols-3 items-center text-base text-white">
        <div><button 
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors" 
          onClick={() => window.showSubscribePopout()}
        >
          Subscribe
        </button></div>
        <div className="text-center">© DexRadar 2025. All rights reserved.</div>
        <div className="text-right space-x-3">
          <button className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </button>
          <Link href="https://twitter.com" className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
