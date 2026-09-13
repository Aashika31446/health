import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import TopProgressBar from "@/components/ui/TopProgressBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CuraMind AI",
  description: "AI Medical Report Explainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${inter.className} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen`}
      >
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
