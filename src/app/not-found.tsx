import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[var(--navy)] px-6 text-center">
      <p className="font-display text-[120px] leading-none text-[var(--pink)] tracking-widest">
        404
      </p>
      <h1 className="font-display text-3xl text-white tracking-widest mt-2 mb-4">
        PAGE NOT FOUND
      </h1>
      <p className="text-white/60 text-base mb-10">
        Looks like this page skipped leg day.
      </p>
      <Link
        href="/"
        className="bg-[var(--pink)] text-white font-semibold px-8 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98]"
      >
        Back to Home
      </Link>
    </section>
  );
}
