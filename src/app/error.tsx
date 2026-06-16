'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[var(--navy)] px-6 text-center">
      <h1 className="font-display text-5xl text-white tracking-widest mb-4">
        BUFF DADDY&apos;S
      </h1>
      <p className="text-white/70 text-lg mb-8">
        Something went sideways. Our bad.
      </p>
      <p className="text-white/40 text-sm mb-10 max-w-sm">{error.message}</p>
      <button
        onClick={reset}
        className="bg-[var(--pink)] text-white font-semibold px-8 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] active:translate-y-0 active:scale-[0.98]"
      >
        Try Again
      </button>
    </section>
  );
}
