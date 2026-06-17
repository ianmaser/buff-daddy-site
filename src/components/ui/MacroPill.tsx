interface MacroPillProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'protein';
}

export default function MacroPill({
  label,
  value,
  variant = 'default',
}: MacroPillProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
        variant === 'protein'
          ? 'bg-cyan/10 border border-cyan text-[var(--cyan-deep)]'
          : 'bg-blush border border-pink/20 text-[var(--navy)]'
      }`}
    >
      {value} {label}
    </span>
  );
}
