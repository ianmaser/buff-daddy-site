export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--blush)]">
      <span
        className="text-6xl animate-pulse"
        role="img"
        aria-label="flexed bicep"
      >
        💪
      </span>
      <p className="font-display text-2xl text-[var(--navy)] tracking-widest mt-6">
        Loading...
      </p>
    </div>
  );
}
