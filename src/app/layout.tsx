import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOOUST STORE",
  description: "Modern ecommerce web application",
  manifest: "/manifest.json",
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
