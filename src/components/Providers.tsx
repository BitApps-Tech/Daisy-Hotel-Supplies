"use client";

import type { ReactNode } from "react";
import { LoadScreen } from "@/components/LoadScreen";
import { QuoteProvider } from "@/context/QuoteContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QuoteProvider>
      <LoadScreen />
      {children}
    </QuoteProvider>
  );
}
