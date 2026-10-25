"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { luxuryEase } from "@/lib/motion";

const MIN_MS = 2400;

export function LoadScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("daisy-loading");
    const started = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(() => {
        setExiting(true);
        window.setTimeout(() => {
          setVisible(false);
          document.documentElement.classList.remove("daisy-loading");
        }, 900);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      window.setTimeout(finish, MIN_MS + 600);
    }

    return () => {
      document.documentElement.classList.remove("daisy-loading");
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="daisy-load"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: luxuryEase }}
          aria-hidden={!visible}
          role="presentation"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14)_0%,transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial="hidden"
            animate={exiting ? "exit" : "show"}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
              exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.88, y: 18 },
                show: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 1.1, ease: luxuryEase },
                },
                exit: {
                  opacity: 0,
                  y: -12,
                  transition: { duration: 0.55, ease: luxuryEase },
                },
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/crest.png"
                alt=""
                className="h-28 w-auto object-contain sm:h-36 md:h-44"
              />
            </motion.div>

            <motion.div
              className="mt-8 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent sm:w-24"
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.9, ease: luxuryEase },
                },
                exit: { opacity: 0, transition: { duration: 0.4 } },
              }}
            />

            <motion.p
              className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37] sm:text-[11px]"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.85, ease: luxuryEase },
                },
                exit: { opacity: 0, transition: { duration: 0.35 } },
              }}
            >
              Shop the Five-Star Suite
            </motion.p>

            <motion.h1
              className="mt-3 font-serif text-3xl font-light tracking-[-0.02em] text-[#FAF8F5] sm:text-4xl md:text-5xl"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, ease: luxuryEase },
                },
                exit: { opacity: 0, y: -8, transition: { duration: 0.4 } },
              }}
            >
              Daisy Hotel Supplies
            </motion.h1>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
