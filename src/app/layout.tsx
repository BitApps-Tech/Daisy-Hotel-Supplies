import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Daisy Hotel Supplies | The Architecture of Five-Star Comfort",
    template: "%s | Daisy Hotel Supplies",
  },
  description:
    "Luxury B2B hospitality procurement for bed & bath linen, guest amenities, banquet supplies, and hotel operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-[#0A0A0A] font-sans text-[#FAF8F5] antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
