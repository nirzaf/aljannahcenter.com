import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al-Jannah Centre | Kochchikade, Negombo",
  description:
    "Al-Jannah Centre for children with special needs and skills in Kochchikade, Negombo.",
  other: {
    "codex-preview": "development",
  },
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
