import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="bg-[#060714] text-white/60 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl tracking-widest text-white mb-2">
            <span className="text-[var(--pink)]">BUFF</span> DADDY&apos;S
          </p>
          <p className="text-sm text-white/40">{siteConfig.tagline}</p>
        </div>

        {/* Nav */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Quick Links
          </p>
          <ul className="space-y-2">
            {siteConfig.footerNav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/50 hover:text-[var(--cyan)] hover:translate-x-0.5 inline-block transition-transform focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060714] rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-sm text-white/30">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="mt-1">{siteConfig.location}</p>
          <p className="mt-1">{siteConfig.instagram}</p>
        </div>
      </div>
    </footer>
  );
}
