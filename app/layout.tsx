import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeedLab — Chemistry + Algebra 2",
  description: "Timed recognition drills for thermodynamics and Algebra 2 function transformations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
