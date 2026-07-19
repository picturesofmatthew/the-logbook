import type { Metadata, Viewport } from "next";
import { Baloo_2, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Logbook",
  description: "A food museum for Matthew & Kennedy",
  appleWebApp: {
    capable: true,
    title: "Logbook",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5eddc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
