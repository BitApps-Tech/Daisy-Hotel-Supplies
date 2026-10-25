"use client";

import { useState, type FormEvent } from "react";
import {
  contact,
  mapsUrl,
  primaryPhone,
  whatsappUrl,
} from "@/data/contact";
import { INQUIRY_TO, type ContactInquiryPayload } from "@/lib/inquiry";
import { inquiryMailto, submitInquiry } from "@/lib/submit-inquiry";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [draft, setDraft] = useState<ContactInquiryPayload | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: ContactInquiryPayload = {
      type: "contact",
      property: String(data.get("property") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    setDraft(payload);
    submitInquiry(payload);
    form.reset();
    setSent(true);
  }

  return (
    <div className="bg-[#FAF8F5] text-[#111111]">
      <section className="bg-[#0A0A0A] pb-20 pt-36 text-[#FAF8F5]">
        <div className="container-site max-w-4xl">
          <p className="eyebrow-gold">Contact</p>
          <h1 className="mt-4 font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Inquire for your property
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-[1.75] text-zinc-400 sm:text-lg">
            Reach {contact.namedContact} and the Daisy team in {contact.city} —
            by phone, WhatsApp, email, or a wholesale inquiry form.
          </p>
        </div>
      </section>

      <section className="container-site grid grid-cols-12 gap-10 py-16 sm:py-24">
        <div className="col-span-12 space-y-10 lg:col-span-5">
          <div>
            <p className="eyebrow-bronze">Direct line</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              {contact.namedContact}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              {contact.city}
            </p>
          </div>

          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                Phone & WhatsApp
              </dt>
              <dd className="mt-2 space-y-2">
                {contact.phones.map((phone) => (
                  <div key={phone.id} className="flex flex-col gap-0.5">
                    <a
                      href={phone.tel}
                      className="text-zinc-800 transition-colors duration-300 hover:text-[#B58E24]"
                    >
                      {phone.international}
                    </a>
                    <span className="text-xs text-zinc-500">{phone.role}</span>
                  </div>
                ))}
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#B58E24] transition-colors duration-300 hover:text-[#9E7B1C]"
                >
                  Message on WhatsApp →
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                Email
              </dt>
              <dd className="mt-2 space-y-1">
                <a
                  href={`mailto:${contact.emails.general}`}
                  className="block text-zinc-800 transition-colors duration-300 hover:text-[#B58E24]"
                >
                  {contact.emails.general}
                </a>
                <a
                  href={`mailto:${contact.emails.sara}`}
                  className="block text-zinc-800 transition-colors duration-300 hover:text-[#B58E24]"
                >
                  {contact.emails.sara}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                Hours
              </dt>
              <dd className="mt-2 space-y-1 text-zinc-700">
                <p>{contact.hours.weekdays}</p>
                <p>{contact.hours.sunday}</p>
              </dd>
            </div>

            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                Social
              </dt>
              <dd className="mt-2">
                <a
                  href={contact.social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-800 transition-colors duration-300 hover:text-[#B58E24]"
                >
                  TikTok
                </a>
              </dd>
            </div>
          </dl>

          <div>
            <p className="eyebrow-bronze mb-4">Boutiques</p>
            <ul className="space-y-4">
              {contact.boutiques.map((shop) => (
                <li key={shop.id} className="border-t border-black/[0.08] pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B58E24]">
                    Boutique {shop.id}
                  </p>
                  <p className="mt-1 text-sm text-zinc-800">{shop.address}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{contact.city}</p>
                  <a
                    href={mapsUrl(shop.mapsQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B58E24] hover:text-[#9E7B1C]"
                  >
                    Open in Maps →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          {sent ? (
            <div className="rounded-[24px] border border-[#B58E24]/25 bg-[#F2EFE9] p-8 md:p-12">
              <p className="eyebrow-bronze">Email ready</p>
              <h3 className="mt-3 font-serif text-3xl">Thank you</h3>
              <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-zinc-600">
                Your mail app should open with this inquiry addressed to{" "}
                <a
                  href={draft ? inquiryMailto(draft) : `mailto:${INQUIRY_TO}`}
                  className="text-[#B58E24] hover:underline"
                >
                  {INQUIRY_TO}
                </a>
                . Send the message from there. {contact.namedContact} and the Daisy
                team will follow up shortly. You can also call{" "}
                <a
                  href={primaryPhone.tel}
                  className="text-[#B58E24] hover:underline"
                >
                  {primaryPhone.international}
                </a>
                .
              </p>
              {draft ? (
                <button
                  type="button"
                  onClick={() => submitInquiry(draft)}
                  className="mt-6 rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
                >
                  Open email again
                </button>
              ) : null}
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-[24px] border border-black/[0.08] bg-white/50 p-8 md:p-12"
            >
              <p className="eyebrow-bronze">Wholesale inquiry</p>
              <h2 className="font-serif text-3xl sm:text-4xl">Send a request</h2>
              {(
                [
                  ["property", "Property name", "text"],
                  ["contact", "Contact name", "text"],
                  ["email", "Work email", "email"],
                  ["phone", "Phone", "tel"],
                ] as const
              ).map(([name, label, type]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                    {label}
                  </span>
                  <input
                    required
                    name={name}
                    type={type}
                    className="w-full rounded-full border border-black/[0.08] bg-[#FAF8F5] px-5 py-3.5 text-sm outline-none focus:border-[#B58E24]/50"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58E24]">
                  Project notes
                </span>
                <textarea
                  name="notes"
                  rows={5}
                  required
                  placeholder="Room count, departments needed, target opening date…"
                  className="w-full rounded-[16px] border border-black/[0.08] bg-[#FAF8F5] px-5 py-4 text-sm outline-none focus:border-[#B58E24]/50"
                />
              </label>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Opens an email to {INQUIRY_TO}
              </p>
              <button
                type="submit"
                className="rounded-full satin-gold px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
              >
                Email inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
