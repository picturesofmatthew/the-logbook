import type { Metadata } from "next";
import { HearthRoom } from "@/components/world/rooms/hearth-room";

// The Hearth Hall — the first real room of the Lighthouse world. Full-screen
// and immersive: the RoomStage is fixed to the viewport, so it stands above the
// app column and chrome as its own place. Additive route — nothing else changes.
export const metadata: Metadata = {
  title: "the hearth hall",
};

export default function HearthPage() {
  return <HearthRoom />;
}
