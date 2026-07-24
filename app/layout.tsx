import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { CaptureSheet } from "@/components/shell/capture-sheet";
import { PageReturn } from "@/components/shell/page-return";
import { PageTransition } from "@/components/shell/page-transition";
import { ShellProvider } from "@/components/shell/shell-provider";
import { SwRegister } from "@/components/sw-register";
import { TzSync } from "@/components/tz-sync";
import { currentTz } from "@/lib/dates";
import { hourInTz, lightStateForHour } from "@/lib/light";
import { getSessionUser } from "@/lib/session";
import "./globals.css";

// Inklight type. Fraunces carries the grimoire display voice (a warm, soft
// old-style serif, via the `font-display` utility); Hanken Grotesk carries
// readable body/UI text and data (the default `font-sans`).
const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "signed × sealed",
  description: "A shared logbook for two.",
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
  const user = await getSessionUser();

  const signedIn = !!user;

  return (
    <html
      lang="en"
      data-light={light}
      className={`${body.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TzSync />
        <SwRegister />
        {signedIn ? (
          <ShellProvider>
            {/* No top bar, no ribbon: the WORLD is the navigation now (the app's
                own rooms open the pages they hold). The legacy pages keep one
                quiet way home — see components/shell/page-return. */}
            <div className="app-column mx-auto flex min-h-dvh w-full max-w-md flex-col px-1 pb-12 pt-6">
              <PageReturn />
              <PageTransition>{children}</PageTransition>
            </div>
            <CaptureSheet />
          </ShellProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
