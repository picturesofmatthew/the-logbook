// The museum's halls. Every specimen lives in exactly one.

export type Hall =
  | "protein"
  | "produce"
  | "grains"
  | "dairy"
  | "snacks"
  | "sweets"
  | "drinks"
  | "dishes";

export const HALLS: { id: Hall; label: string; emoji: string }[] = [
  { id: "protein", label: "Protein Hall", emoji: "🍗" },
  { id: "produce", label: "Produce Wing", emoji: "🥬" },
  { id: "grains", label: "Grain Gallery", emoji: "🍞" },
  { id: "dairy", label: "Dairy Parlor", emoji: "🥛" },
  { id: "snacks", label: "Snack Vault", emoji: "🥨" },
  { id: "sweets", label: "Sweets Nook", emoji: "🍪" },
  { id: "drinks", label: "Drink Fountain", emoji: "🍵" },
  { id: "dishes", label: "Dish Gallery", emoji: "🍲" },
];

export function hallInfo(id: Hall) {
  return HALLS.find((h) => h.id === id) ?? HALLS[7];
}
