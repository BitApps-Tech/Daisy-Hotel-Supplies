import Link from "next/link";
import { DaisyLogo } from "@/components/DaisyLogo";
import { includedDepartments } from "@/data/catalog";
import { contact, primaryPhone, whatsappUrl } from "@/data/contact";

export function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#0A0A0A] text-[#FAF8F5]">
      <div className="container-site grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <DaisyLogo markClassName="h-16 w-auto md:h-20" />
          <p className="mt-6 max-w-[42ch] font-sans text-base leading-[1.75] text-zinc-400">
            Direct international hospitality procurement for hotels that measure
            comfort in thread count, GSM, and guest return rate.
          </p>
          <p className="mt-4 text-sm text-zinc-500">{contact.city}</p>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow-gold mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <a href={primaryPhone.tel} className="hover:text-[#D4AF37]">
                {primaryPhone.international}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37]"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.emails.general}`}
                className="hover:text-[#D4AF37]"
              >
                {contact.emails.general}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.emails.sara}`}
                className="hover:text-[#D4AF37]"
              >
                {contact.emails.sara}
              </a>
            </li>
            <li>
              <a
                href={contact.social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37]"
              >
                TikTok
              </a>
            </li>
            <li className="pt-2 text-xs leading-relaxed text-zinc-500">
              {contact.hours.weekdays}
              <br />
              {contact.hours.sunday}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow-gold mb-4">Explore</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/collections" className="hover:text-[#D4AF37]">
                All Collections
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#D4AF37]">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow-gold mb-4">Departments</p>
          <ul className="space-y-2 text-sm text-zinc-400">
            {includedDepartments.slice(0, 6).map((department) => (
              <li key={department.slug}>
                <Link
                  href={`/collections/${department.slug}`}
                  className="hover:text-[#D4AF37]"
                >
                  {department.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/collections"
                className="text-[#D4AF37] hover:text-[#E6C786]"
              >
                View all →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site border-t border-white/10 py-6 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        © {new Date().getFullYear()} Daisy Hotel Supplies · {contact.city}
      </div>
    </footer>
  );
}
