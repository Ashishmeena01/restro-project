import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl sm:text-8xl text-emerald-600">404</p>
      <h1 className="mt-3 font-display text-2xl sm:text-3xl text-slate-900">This dish isn&apos;t on our menu</h1>
      <p className="mt-1 text-sm text-slate-500">यह पेज उपलब्ध नहीं है</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/menu"
          className="mi-press inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          View Menu
        </Link>
        <Link
          href="/"
          className="mi-press inline-flex items-center justify-center border border-slate-300 hover:bg-white text-slate-700 px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
