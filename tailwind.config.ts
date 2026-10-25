import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        charcoal: "#121212",
        alabaster: "#FAF8F5",
        cashmere: "#F2EFE9",
        champagne: "#D4AF37",
        bronze: "#B58E24",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
