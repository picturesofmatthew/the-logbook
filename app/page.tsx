import Link from "next/link";
import { PixelSprite } from "@/components/pixel-sprite";
import { PET_HAPPY, PET_PALETTE } from "@/components/sprites";
import type { Profile } from "@/lib/auth";
import { currentProfile } from "@/lib/session";

const NICE_NAMES: Record<Profile, string> = {
  matthew: "Matthew",
  kennedy: "Kennedy",
};

export default async function Home() {
  const profile = await currentProfile();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <PixelSprite
        map={PET_HAPPY}
        palette={PET_PALETTE}
        className="h-24 w-24"
        title="A small moss-green creature"
      />
      <h1 className="font-pixel text-2xl tracking-wide">
        Welcome in, {NICE_NAMES[profile]}.
      </h1>
      <p className="max-w-xs text-ink-soft">
        The museum awaits its first donation. The journal, the halls, and a
        small hungry creature are all on their way.
      </p>
      <Link
        href="/enter"
        className="text-sm text-ink-soft underline decoration-dotted underline-offset-4"
      >
        switch profile
      </Link>
    </main>
  );
}
