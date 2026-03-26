import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackStreak — Turn Saving Into a Daily Win",
  description: "Gamified savings challenges that make saving money feel like winning. Streaks, badges, AI coaching. Free to start.",
  keywords: "savings challenge, save money, 52 week challenge, no spend, budgeting app, money saving",
  openGraph: {
    title: "StackStreak — Turn Saving Into a Daily Win",
    description: "Gamified savings challenges with streaks, badges & AI coaching. Free to start.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
