import { content } from '@/content';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[var(--navy)] text-white text-xs tracking-widest text-center py-2 px-4">
      {content.announcement.text}{' '}
      <a
        href={content.announcement.linkHref}
        className="text-[var(--cyan)] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)] rounded"
      >
        {content.announcement.linkLabel}
      </a>
    </div>
  );
}
