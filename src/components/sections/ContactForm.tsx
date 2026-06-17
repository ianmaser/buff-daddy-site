'use client';

import { useState } from 'react';
import { content } from '@/content';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const INPUT_CLASS =
  'w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]';

export default function ContactForm(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function clearFieldError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim() || !email.includes('@')) next.email = 'A valid email is required.';
    if (!subject) next.subject = 'Please select a subject.';
    if (!message.trim()) next.message = 'Message is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setSubmitError(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white/[0.06] border border-white/10 rounded-2xl p-8 flex flex-col gap-5"
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-semibold text-white/80">
          Name *
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
          placeholder="Your name"
          className={INPUT_CLASS}
        />
        {errors.name && <p className="text-[var(--pink)] text-xs">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-semibold text-white/80">
          Email *
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
          placeholder="you@example.com"
          className={INPUT_CLASS}
        />
        {errors.email && <p className="text-[var(--pink)] text-xs">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-sm font-semibold text-white/80">
          Subject *
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); clearFieldError('subject'); }}
          className={`${INPUT_CLASS} bg-[#0D0E2B]`}
        >
          <option value="">Select a subject</option>
          {content.contact.subjectOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.subject && <p className="text-[var(--pink)] text-xs">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-semibold text-white/80">
          Message *
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); clearFieldError('message'); }}
          placeholder="What's on your mind?"
          rows={4}
          className={`${INPUT_CLASS} resize-none`}
        />
        {errors.message && <p className="text-[var(--pink)] text-xs">{errors.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className={`w-full font-semibold py-3.5 rounded-full transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none ${
          status === 'success'
            ? 'bg-[var(--cyan)] text-[var(--navy)] opacity-100'
            : 'bg-[var(--pink)] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] disabled:opacity-60'
        }`}
      >
        {status === 'success'
          ? '✓ Message Sent!'
          : status === 'loading'
          ? 'Sending...'
          : 'Send Message'}
      </button>

      {submitError && (
        <p className="text-[var(--pink)] text-sm text-center">{submitError}</p>
      )}
    </form>
  );
}
