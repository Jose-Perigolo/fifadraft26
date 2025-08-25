import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA Draft 2026",
  description: "Organize your FIFA championship draft with 8 players building teams of 16 players each",
  keywords: "FIFA, Draft, Championship, Football, Soccer, FC25",
  authors: [{ name: "FIFA Draft Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
