import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientComponents } from "@/components/shared/client-components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevToolkit - Essential Tools for Developers",
  description: "Free developer tools for formatting, converting, testing and generating. JSON formatter, Base64 encoder, Regex tester, API tester and more.",
  openGraph: {
    title: "DevToolkit",
    description: "Essential tools for developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ClientComponents />
      </body>
    </html>
  );
}
