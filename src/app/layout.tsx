import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { PWAInstall } from "@/components/PWAInstall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOOUST STORE",
  description: "Modern ecommerce web application",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  manifest: "/manifest.json",
  openGraph: {
    title: "JOOUST STORE",
    description: "Modern ecommerce web application",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JOOUST STORE",
    description: "Modern ecommerce web application",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInstall />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
