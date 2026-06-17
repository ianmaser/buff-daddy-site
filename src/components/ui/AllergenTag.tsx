interface AllergenTagProps {
  label: string;
}

export default function AllergenTag({ label }: AllergenTagProps): React.ReactElement {
  return (
    <span className="inline-flex items-center bg-[var(--navy)] text-white rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
      {label}
    </span>
  );
}
