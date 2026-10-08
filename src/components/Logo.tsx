interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Arcanum mark: an inverted A (the "for all" quantifier, a nod to evals)
 * with a deep red crossbar.
 */
export function LogoMark({ size = 26, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="4,4 13,4 24,26 35,4 44,4 24,44" fill="var(--ink)" />
      <polygon points="16.5,11 31.5,11 28,18 20,18" fill="var(--red)" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <a className="brand" href="#top" aria-label="Arcanum home">
      <LogoMark />
      <span>Arcanum</span>
    </a>
  );
}
