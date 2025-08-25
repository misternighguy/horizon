import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center space-y-4">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-gray-600">We couldn&apos;t find that page. Try the research browser or go home.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="border rounded px-3 py-1">Home</Link>
        <Link href="/research" className="border rounded px-3 py-1">Browse research</Link>
      </div>
    </div>
  );
}
