import { siteConfig } from '@/config/site';
import { content } from '@/content';

export default function SocialStrip() {
  return (
    <div className="bg-[var(--pink)] py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
      <p className="text-white font-bold uppercase tracking-widest text-sm">
        {content.social.prompt}
      </p>
      <div className="flex gap-3">
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 text-white border border-white/40 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-white hover:text-[var(--pink)] hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pink)]"
        >
          Instagram {siteConfig.instagram}
        </a>
        <a
          href={siteConfig.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 text-white border border-white/40 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-white hover:text-[var(--pink)] hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pink)]"
        >
          TikTok {siteConfig.tiktok}
        </a>
      </div>
    </div>
  );
}
