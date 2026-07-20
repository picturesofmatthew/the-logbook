import type { Metadata, Viewport } from "next";
import { Baloo_2, Pixelify_Sans } from "next/font/google";
import { SwRegister } from "@/components/sw-register";
import { TzSync } from "@/components/tz-sync";
import { currentTz } from "@/lib/dates";
import { hourInTz, lightStateForHour } from "@/lib/light";
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
  title: "signxsealed",
  description: "A shared logbook for Matthew & Kennedy",
  appleWebApp: {
    capable: true,
    title: "signxsealed",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5eddc",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const light = lightStateForHour(hourInTz(new Date(), await currentTz()));
  return (
    <html
      lang="en"
      data-light={light}
      className={`${baloo.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TzSync />
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
