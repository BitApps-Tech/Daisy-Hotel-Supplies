"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type CatalogProduct } from "@/data/catalog";

export type QuoteItem = {
  product: CatalogProduct;
  quantity: number;
  note?: string;
};

/** Prefer live catalog assets so quote bag survives image path migrations (e.g. → WebP). */
function refreshQuoteItem(item: QuoteItem): QuoteItem | null {
  const slug = item?.product?.slug;
  if (!slug) return null;
  const live = getProduct(slug);
  const quantity = Math.max(1, Number(item.quantity) || 1);
  if (live) {
    return { product: live, quantity, note: item.note };
  }
  const image = String(item.product.image || "").replace(
    /\.(jpe?g|png|gif)$/i,
    ".webp",
  );
  return {
    ...item,
    quantity,
    product: { ...item.product, image },
  };
}

type QuoteContextValue = {
  items: QuoteItem[];
  isOpen: boolean;
  openQuote: () => void;
  closeQuote: () => void;
  toggleQuote: () => void;
  addToQuote: (product: CatalogProduct, quantity?: number) => void;
  removeFromQuote: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearQuote: () => void;
  itemCount: number;
};

const STORAGE_KEY = "daisy-quote-bag";

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QuoteItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .map(refreshQuoteItem)
              .filter((item): item is QuoteItem => Boolean(item)),
          );
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToQuote = useCallback((product: CatalogProduct, quantity = 50) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.slug === product.slug);
      if (existing) {
        return current.map((item) =>
          item.product.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromQuote = useCallback((slug: string) => {
    setItems((current) => current.filter((item) => item.product.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.slug === slug
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const clearQuote = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      isOpen,
      openQuote: () => setIsOpen(true),
      closeQuote: () => setIsOpen(false),
      toggleQuote: () => setIsOpen((open) => !open),
      addToQuote,
      removeFromQuote,
      setQuantity,
      clearQuote,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items, isOpen, addToQuote, removeFromQuote, setQuantity, clearQuote],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
}
