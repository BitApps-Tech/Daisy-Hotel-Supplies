import { contact } from "@/data/contact";

export const INQUIRY_TO = contact.emails.general;

export type ContactInquiryPayload = {
  type: "contact";
  property: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
};

export type QuoteInquiryPayload = {
  type: "quote";
  property: string;
  contact: string;
  email: string;
  phone: string;
  items: {
    title: string;
    slug: string;
    quantity: number;
    badge?: string | null;
    departmentSlug?: string;
    subcategorySlug?: string;
  }[];
};

export type InquiryPayload = ContactInquiryPayload | QuoteInquiryPayload;

export function inquirySubject(payload: InquiryPayload) {
  if (payload.type === "quote") {
    return `Wholesale RFQ — ${payload.property} (${payload.items.length} items)`;
  }
  return `Website inquiry — ${payload.property}`;
}

export function inquiryText(payload: InquiryPayload) {
  const lines = [
    `Type: ${payload.type === "quote" ? "Wholesale quote bag" : "Contact form"}`,
    `To: ${INQUIRY_TO}`,
    "",
    `Property: ${payload.property}`,
    `Contact: ${payload.contact}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
  ];

  if (payload.type === "contact") {
    lines.push("", "Notes:", payload.notes);
  } else {
    lines.push("", "Quote items:");
    for (const item of payload.items) {
      lines.push(
        `- ${item.title} × ${item.quantity}` +
          (item.badge ? ` (${item.badge})` : "") +
          ` [${item.slug}]`,
      );
    }
  }

  lines.push("", `Submitted: ${new Date().toISOString()}`);
  return lines.join("\n");
}
