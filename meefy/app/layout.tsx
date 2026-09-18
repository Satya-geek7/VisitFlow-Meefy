import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VisitFlow (MEEFY) — Visitor & Appointment Management System",
  description: "Enterprise digital visitor intelligence, approvals, dynamic QR passes, and gate scan operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#18181B] font-sans">
        {children}
      </body>
    </html>
  );
}
