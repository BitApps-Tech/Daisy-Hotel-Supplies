"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { INQUIRY_TO, type QuoteInquiryPayload } from "@/lib/inquiry";
import { luxuryEase } from "@/lib/motion";
import { submitInquiry } from "@/lib/submit-inquiry";

const PRESETS = [50, 100, 250, 500];

export function QuoteDrawer() {
  const { items, isOpen, closeQuote, setQuantity, removeFromQuote } = useQuote();
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState<QuoteInquiryPayload | null>(null);
  const [form, setForm] = useState({
    property: "",
    contact: "",
    email: "",
    phone: "",
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const payload: QuoteInquiryPayload = {
      type: "quote",
      property: form.property.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      items: items.map((item) => ({
        title: item.product.title,
        slug: item.product.slug,
        quantity: item.quantity,
        badge: item.product.badge,
        departmentSlug: item.product.departmentSlug,
        subcategorySlug: item.product.subcategorySlug,
      })),
    };
    setDraft(payload);
    submitInquiry(payload);
    setSubmitted(true);
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close quote bag"
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuote}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: luxuryEase }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col border-l border-[#D4AF37]/25 bg-[#0A0A0A] text-[#FAF8F5] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="eyebrow-gold">Wholesale RFQ</p>
                <h2 className="mt-1 font-serif text-3xl">Quote Bag</h2>
              </div>
              <button
                type="button"
                onClick={closeQuote}
                className="text-[#FAF8F5] transition-colors duration-300 hover:text-[#D4AF37]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {submitted ? (
                <div className="rounded-[16px] border border-[#D4AF37]/25 bg-[#121212] p-6">
                  <p className="eyebrow-gold">Email ready</p>
                  <h3 className="mt-3 font-serif text-3xl">Thank you</h3>
                  <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-zinc-400">
                    Your mail app should open with this quote bag addressed to{" "}
                    <span className="text-[#D4AF37]">{INQUIRY_TO}</span>. Send
                    the message from there. Our hospitality team will respond
                    with availability and a tailored wholesale quotation.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {draft ? (
                      <button
                        type="button"
                        onClick={() => submitInquiry(draft)}
                        className="rounded-full satin-gold px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]"
                      >
                        Open email again
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        closeQuote();
                      }}
                      className="rounded-full border border-white/15 px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5] transition-colors duration-300 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                    >
                      Continue browsing
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <p className="text-sm leading-relaxed text-zinc-400">
                  Your quote bag is empty. Add products from the catalog to build
                  a wholesale request.
                </p>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li
                      key={item.product.slug}
                      className="grid grid-cols-[88px_1fr] gap-4 border-b border-white/10 pb-6"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-[88px] w-[88px] rounded-[12px] object-cover"
                      />
                      <div>
                        <h3 className="font-serif text-xl leading-snug">
                          {item.product.title}
                        </h3>
                        {item.product.badge ? (
                          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                            {item.product.badge}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() =>
                                setQuantity(
                                  item.product.slug,
                                  preset === 500 ? 500 : preset,
                                )
                              }
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
                                item.quantity === preset ||
                                (preset === 500 && item.quantity >= 500)
                                  ? "border-[#D4AF37]/50 text-[#D4AF37]"
                                  : "border-white/15 text-zinc-400 hover:border-[#D4AF37]/30 hover:text-[#FAF8F5]"
                              }`}
                            >
                              {preset === 500 ? "500+" : preset}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <label className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Qty
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(event) =>
                              setQuantity(
                                item.product.slug,
                                Number(event.target.value) || 1,
                              )
                            }
                            className="w-24 rounded-full border border-white/15 bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#0A0A0A] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromQuote(item.product.slug)}
                            className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-colors duration-300 hover:text-[#D4AF37]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!submitted && items.length > 0 ? (
              <form
                onSubmit={onSubmit}
                className="space-y-3 border-t border-white/10 px-6 py-5"
              >
                {(
                  [
                    ["property", "Property name"],
                    ["contact", "Contact name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                  ] as const
                ).map(([key, label]) => (
                  <input
                    key={key}
                    required
                    type={
                      key === "email" ? "email" : key === "phone" ? "tel" : "text"
                    }
                    placeholder={label}
                    value={form[key]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="w-full rounded-full border border-white/10 bg-[#FAF8F5] px-4 py-3 text-sm text-[#0A0A0A] outline-none placeholder:text-zinc-500"
                  />
                ))}
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Opens an email to {INQUIRY_TO}
                </p>
                <button
                  type="submit"
                  className="w-full rounded-full satin-gold py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-opacity duration-300 hover:opacity-90"
                >
                  Email wholesale RFQ
                </button>
              </form>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
