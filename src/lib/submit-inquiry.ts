import {
  INQUIRY_TO,
  inquirySubject,
  inquiryText,
  type InquiryPayload,
} from "@/lib/inquiry";

export function inquiryMailto(payload: InquiryPayload) {
  const subject = encodeURIComponent(inquirySubject(payload));
  const body = encodeURIComponent(inquiryText(payload));
  return `mailto:${INQUIRY_TO}?subject=${subject}&body=${body}`;
}

export function submitInquiry(payload: InquiryPayload) {
  window.location.href = inquiryMailto(payload);
}
