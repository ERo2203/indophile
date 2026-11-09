/** The Indophile mark: a section through stratified earth — layers of time. */
export function Mark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.2 12.5c4.2-1.6 8.4 1.2 12.8 0s8.6-1.8 12.8-.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.4 17.4c4.6-1.2 9 1.4 13.6.2s9-1.4 13.6 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 22.4c4-1 7.8 1 12 0s8-1 12 0" fill="none" stroke="var(--color-terracotta)" strokeWidth="1.5" />
      <circle cx="19.5" cy="25.6" r="1.3" fill="var(--color-terracotta)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="font-display text-[1.45rem] font-semibold tracking-[0.2em] leading-none">INDOPHILE</span>
    </span>
  );
}
