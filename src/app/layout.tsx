import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";
import { MotionConfig } from "motion/react";
import "./globals.css";

const bonny = localFont({
  variable: "--font-bonny-local",
  src: [
    { path: "./fonts/bonny/Bonny-Thin.woff2", weight: "100", style: "normal" },
    { path: "./fonts/bonny/Bonny-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/bonny/Bonny-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/bonny/Bonny-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/bonny/Bonny-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin-google",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kaboul House — Bazar oriental à Grenoble",
    template: "%s — Kaboul House",
  },
  description:
    "Tapis noués main, toshak kabuli, textiles, art de la table et fruits secs — de Kaboul, Téhéran et Istanbul jusqu'au cœur de Grenoble.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bonny.variable} ${josefin.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
