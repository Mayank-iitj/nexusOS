import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusOS — AI Productivity Operating System",
  description:
    "One Goal. One Prompt. Infinite Productivity. NexusOS is an AI Operating System that autonomously orchestrates work across Gmail, Calendar, Drive, Slack, GitHub, Notion, Jira, and more.",
  keywords: [
    "AI",
    "productivity",
    "operating system",
    "automation",
    "multi-agent",
    "workflow",
    "SaaS",
  ],
  authors: [{ name: "NexusOS Team" }],
  openGraph: {
    title: "NexusOS — AI Productivity Operating System",
    description: "One Goal. One Prompt. Infinite Productivity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
