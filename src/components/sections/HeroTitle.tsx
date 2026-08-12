"use client";

import { motion } from "motion/react";

const NBSP = " ";

export function HeroTitle({ title }: { title: string }) {
  return (
    <h1 className="max-w-3xl font-bonny text-5xl font-bold leading-[.9] md:text-7xl">
      {title.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "0.8em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {NBSP}
        </span>
      ))}
    </h1>
  );
}

/** Sous-titre du hero — même signature d'animation, décalée après le titre. */
export function HeroSubtitle({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.p
      className="mt-sp-4 max-w-xl font-light leading-relaxed"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 0.95 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.p>
  );
}
