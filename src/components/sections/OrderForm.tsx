'use client';

import { useState } from 'react';
import { content } from '@/content';
import { products } from '@/data/products';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

interface ItemRow {
  itemName: string;
  qty: number;
}

interface FormErrors {
  name?: string;
  contact?: string;
  items?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const ITEM_OPTIONS = [
  ...products.filter((p) => !p.comingSoon).map((p) => p.name),
  'Mixed Box (6 items)',
  'Mixed Box (12 items)',
];

const INPUT_CLASS =
  'border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[var(--navy)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 w-full';

export default function OrderForm(): React.ReactElement {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [pickupWindow, setPickupWindow] = useState('');
  const [items, setItems] = useState<ItemRow[]>([{ itemName: '', qty: 1 }]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function clearFieldError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!contact.trim()) next.contact = 'Contact is required.';
    const hasValidItem = items.some((item) => item.itemName && item.qty > 0);
    if (!hasValidItem) next.items = 'Please select at least one item with a quantity.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function addItem() {
    setItems((prev) => [...prev, { itemName: '', qty: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemRow, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setSubmitError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          pickupWindow,
          items: items.filter((item) => item.itemName && item.qty > 0),
          notes,
        }),
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

  if (status === 'success') {
    return (
      <section id="order" className="bg-gradient-to-br from-lavender to-[#F8F0FF] py-20 px-6">
        <div className="max-w-lg mx-auto text-center py-12">
          <span className="text-6xl" role="img" aria-label="check mark">✅</span>
          <h2 className="font-display text-5xl text-[var(--navy)] mt-6 mb-4">
            {content.order.successTitle}
          </h2>
          <p className="text-[var(--text-light)] leading-relaxed">{content.order.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="bg-gradient-to-br from-lavender to-[#F8F0FF] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left — info */}
        <div className="flex flex-col gap-5">
          <SectionEyebrow>{content.order.eyebrow}</SectionEyebrow>
          <h2 className="font-display text-5xl text-[var(--navy)] leading-none">
            {content.order.headline}
          </h2>
          <p className="text-[var(--text-light)] leading-relaxed">{content.order.subtext}</p>
          <div className="border-l-4 border-[var(--pink)] bg-white/60 rounded-r-xl p-4">
            <p className="text-sm text-[var(--navy)] leading-relaxed">
              <strong className="text-[var(--cyan-deep)]">Note: </strong>
              {content.order.note}
            </p>
          </div>
        </div>

        {/* Right — form card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-name" className="text-sm font-semibold text-[var(--navy)]">
              Name *
            </label>
            <input
              id="order-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
              placeholder="Your name"
              className={INPUT_CLASS}
            />
            {errors.name && <p className="text-[var(--pink)] text-xs">{errors.name}</p>}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-contact" className="text-sm font-semibold text-[var(--navy)]">
              Phone or Email *
            </label>
            <input
              id="order-contact"
              type="text"
              value={contact}
              onChange={(e) => { setContact(e.target.value); clearFieldError('contact'); }}
              placeholder="How we reach you"
              className={INPUT_CLASS}
            />
            {errors.contact && <p className="text-[var(--pink)] text-xs">{errors.contact}</p>}
          </div>

          {/* Pickup window */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-pickup" className="text-sm font-semibold text-[var(--navy)]">
              Pickup Window
            </label>
            <input
              id="order-pickup"
              type="text"
              value={pickupWindow}
              onChange={(e) => setPickupWindow(e.target.value)}
              placeholder="e.g. Weekend mornings, weekday evenings"
              className={INPUT_CLASS}
            />
          </div>

          {/* Item rows */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[var(--navy)]">Items *</p>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  aria-label={`Item ${i + 1} name`}
                  value={item.itemName}
                  onChange={(e) => { updateItem(i, 'itemName', e.target.value); clearFieldError('items'); }}
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--navy)] bg-white focus:outline-none focus:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
                >
                  <option value="">Select item</option>
                  {ITEM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="number"
                  aria-label={`Quantity for item ${i + 1}`}
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value, 10) || 1)}
                  className="w-16 shrink-0 border border-gray-200 rounded-xl px-2 py-2.5 text-sm text-[var(--navy)] text-center focus:outline-none focus:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${i + 1}`}
                    className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[var(--pink)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {errors.items && <p className="text-[var(--pink)] text-xs">{errors.items}</p>}
            <button
              type="button"
              onClick={addItem}
              className="border-2 border-dashed border-gray-200 rounded-xl py-2 text-sm text-[var(--text-light)] hover:border-[var(--cyan)] hover:text-[var(--cyan-deep)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
            >
              + Add another item
            </button>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-notes" className="text-sm font-semibold text-[var(--navy)]">
              Notes{' '}
              <span className="font-normal text-[var(--text-light)]">(optional)</span>
            </label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, special requests, etc."
              rows={3}
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[var(--pink)] text-white font-semibold py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,62,165,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2"
          >
            {status === 'loading' ? 'Sending...' : 'Send My Order 💪'}
          </button>

          {submitError && (
            <p className="text-[var(--pink)] text-sm text-center">{submitError}</p>
          )}
        </form>
      </div>
    </section>
  );
}
