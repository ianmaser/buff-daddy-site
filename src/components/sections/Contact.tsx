import { content } from '@/content';
import { siteConfig } from '@/config/site';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import ContactForm from './ContactForm';

const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(rgba(0,212,200,0.07) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,62,165,0.04) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '60px 60px',
};

const DETAIL_ROWS = [
  { icon: '📍', label: 'Location', value: siteConfig.location },
  { icon: '📸', label: 'Instagram', value: siteConfig.instagram },
  { icon: '🌐', label: 'Website', value: siteConfig.websiteDisplay },
] as const;

export default function Contact(): React.ReactElement {
  return (
    <section id="contact" className="relative bg-[var(--navy)] py-20 px-6 overflow-hidden">
      {/* Synthwave grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={GRID_OVERLAY_STYLE}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left — info */}
        <div className="flex flex-col gap-6">
          <SectionEyebrow color="cyan">{content.contact.eyebrow}</SectionEyebrow>

          <h2 className="font-display text-5xl text-white leading-none">
            {content.contact.headline}
          </h2>

          <p className="text-white/60 leading-relaxed">{content.contact.subtext}</p>

          <div className="flex flex-col gap-3 mt-2">
            {DETAIL_ROWS.map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3"
              >
                <span
                  className="text-xl shrink-0"
                  role="img"
                  aria-label={label}
                >
                  {icon}
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cyan)]">
                    {label}
                  </p>
                  <p className="text-sm text-white/70">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — client form */}
        <ContactForm />
      </div>
    </section>
  );
}
