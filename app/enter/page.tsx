import type { Metadata } from "next";
import { PixelSprite } from "@/components/pixel-sprite";
import { PET_HAPPY, PET_PALETTE } from "@/components/sprites";
import { EnterForm } from "./enter-form";

export const metadata: Metadata = {
  title: "Come in - The Logbook",
};

export default function EnterPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="wobbly border-2 border-ink/20 bg-cream/70 p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <PixelSprite
              map={PET_HAPPY}
              palette={PET_PALETTE}
              className="h-20 w-20"
              title="A small moss-green creature"
            />
            <h1 className="font-pixel text-3xl tracking-wide">THE LOGBOOK</h1>
            <p className="text-ink-soft">a food museum for two</p>
          </div>
          <EnterForm />
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          someone small is waiting inside
        </p>
      </div>
    </main>
  );
}
