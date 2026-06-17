interface SectionEyebrowProps {
  children: React.ReactNode;
  color?: 'pink' | 'cyan';
}

export default function SectionEyebrow({
  children,
  color = 'pink',
}: SectionEyebrowProps): React.ReactElement {
  return (
    <p
      className={`text-[11px] font-bold tracking-widest uppercase ${
        color === 'cyan' ? 'text-[var(--cyan)]' : 'text-[var(--pink)]'
      }`}
    >
      {children}
    </p>
  );
}
