// The Glade's light script — pure functions, no server imports.
// Three states follow the keeper's local clock (tz cookie): the app is paper
// by day, amber at dusk, and lantern-lit at night. Dawn folds into day.

export type LightState = "day" | "dusk" | "night";

export function lightStateForHour(hour: number): LightState {
  if (hour >= 6 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

export function hourInTz(d: Date, tz: string): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hourCycle: "h23",
    }).format(d),
  );
}
