import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudySync AI — Smart Student Productivity Platform",
  description:
    "An AI-powered productivity platform for students. Manage studies, track consistency, compete anonymously, share roadmaps, and build discipline.",
  keywords: [
    "study planner",
    "student productivity",
    "pomodoro timer",
    "GATE preparation",
    "UPSC preparation",
    "competitive learning",
    "study tracker",
  ],
  authors: [{ name: "StudySync AI" }],
  openGraph: {
    title: "StudySync AI — Smart Student Productivity Platform",
    description:
      "An AI-powered productivity platform for students. Manage studies, track consistency, compete anonymously.",
    type: "website",
    siteName: "StudySync AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
