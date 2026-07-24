import type { Metadata } from "next";
import Link from "next/link";
import { DoorGround } from "@/components/world/door-ground";
import { EnterForm } from "./enter-form";

export const metadata: Metadata = {
  title: "Come in — signed × sealed",
};

export default function EnterPage() {
  return (
    <DoorGround
      footer={
        <>
          <p>
            new here? <Link href="/join">begin a book</Link>
          </p>
          <p className="mt-2 text-xs opacity-75">
            <Link href="/privacy">privacy &amp; your health data</Link>
          </p>
        </>
      }
    >
      <div className="wobbly border-2 border-gold/30 bg-cream/90 p-7 shadow-card">
        <p className="mb-5 text-center font-display text-[11px] tracking-[0.18em] text-ink-soft">
          THE LAMP IS LIT · COME IN
        </p>
        <EnterForm />
      </div>
    </DoorGround>
  );
}
