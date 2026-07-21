import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import { CaptureSheet } from "@/components/shell/capture-sheet";
import { PageTransition } from "@/components/shell/page-transition";
import { Ribbon } from "@/components/shell/ribbon";
import { ShellProvider } from "@/components/shell/shell-provider";
import { TopBar } from "@/components/shell/top-bar";
import { SwRegister } from "@/components/sw-register";
import { TzSync } from "@/components/tz-sync";
import { DISPLAY_NAMES, SESSION_COOKIE, verifySession } from "@/lib/auth";
import { currentTz, todayIso } from "@/lib/dates";
import { hourInTz, lightStateForHour } from "@/lib/light";
import "./globals.css";

// Inklight type. Fraunces carries the grimoire display voice (a warm, soft
// old-style serif); Hanken Grotesk carries readable body/UI text and data.
// NOTE: the `font-pixel` utility now maps to Fraunces — the name is a leftover
// from the retired pixel language and gets renamed to `font-display` later.
const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "signed × sealed",
  description: "A shared logbook for Matthew & Kennedy",
  appleWebApp: {
    capable: true,
    title: "signed × sealed",
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
  const tz = await currentTz();
  const light = lightStateForHour(hourInTz(new Date(), tz));

  // Read the session without redirecting — the middleware already gates every
  // route but /enter, so a null profile here means we're on the door, which
  // must render bare (no chrome, no profile).
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const profile = await verifySession(token);

  let chrome: { name: string; dateLabel: string } | null = null;
  if (profile) {
    const today = await todayIso();
    const dateLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
    }).format(new Date(today + "T12:00:00"));
    chrome = { name: DISPLAY_NAMES[profile], dateLabel };
  }

  return (
    <html
      lang="en"
      data-light={light}
      className={`${body.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TzSync />
        <SwRegister />
        {chrome ? (
          <ShellProvider>
            <TopBar name={chrome.name} dateLabel={chrome.dateLabel} />
            <div className="app-column mx-auto flex min-h-dvh w-full max-w-md flex-col pb-24 pt-16">
              <PageTransition>{children}</PageTransition>
            </div>
            <Ribbon />
            <CaptureSheet />
          </ShellProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
