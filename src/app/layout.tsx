import type { Metadata } from "next";
import "./globals.css";

// page title
export const metadata: Metadata = {
  title: "StudySync - Student Productivity App",
  description: "A study productivity app for students",
};

// root layout
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
