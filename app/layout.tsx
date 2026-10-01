import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panashe Fencing & Hardware Solutions | Fencing Harare",
  description: "Diamond mesh, gates, hardware, security fencing and professional fence installation in Harare and across Zimbabwe.",
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
