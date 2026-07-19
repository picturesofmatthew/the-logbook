// Pure calculator math — no imports, usable on server and client.

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export const ACTIVITY_LEVELS: {
  id: ActivityLevel;
  label: string;
  hint: string;
  multiplier: number;
}[] = [
  { id: "sedentary", label: "Mostly resting", hint: "desk days, little movement", multiplier: 1.2 },
  { id: "light", label: "Lightly moving", hint: "walks, 1-3 workouts a week", multiplier: 1.375 },
  { id: "moderate", label: "Regularly moving", hint: "3-5 workouts a week", multiplier: 1.55 },
  { id: "active", label: "Very active", hint: "6-7 workouts a week", multiplier: 1.725 },
  { id: "very_active", label: "Always moving", hint: "physical job + training", multiplier: 1.9 },
];

export function ageFromBirthdate(birthdate: string, todayIso: string): number {
  const b = new Date(birthdate + "T00:00:00");
  const t = new Date(todayIso + "T00:00:00");
  let age = t.getFullYear() - b.getFullYear();
  const beforeBirthday =
    t.getMonth() < b.getMonth() ||
    (t.getMonth() === b.getMonth() && t.getDate() < b.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function mifflinStJeor(input: {
  sex: Sex;
  weightLb: number;
  heightIn: number;
  age: number;
}): number {
  const kg = input.weightLb * 0.45359237;
  const cm = input.heightIn * 2.54;
  const base = 10 * kg + 6.25 * cm - 5 * input.age;
  return Math.round(base + (input.sex === "male" ? 5 : -161));
}

export function tdeeFromBmr(bmr: number, activity: ActivityLevel): number {
  const level = ACTIVITY_LEVELS.find((a) => a.id === activity);
  return Math.round(bmr * (level?.multiplier ?? 1.2));
}

// Conservative, cut-safe deficit presets. Nothing steeper than 500 on purpose.
export const DEFICITS = [
  { id: "gentle", label: "Gentle", kcal: 250, perWeekLb: 0.5 },
  { id: "steady", label: "Steady", kcal: 375, perWeekLb: 0.75 },
  { id: "brisk", label: "Brisk", kcal: 500, perWeekLb: 1.0 },
] as const;

// Calorie floors: below these, a cut stops being nourishing.
export function calorieFloor(sex: Sex): number {
  return sex === "female" ? 1200 : 1500;
}

export function suggestTargets(input: {
  tdeeKcal: number;
  weightLb: number;
  deficitKcal: number;
  sex: Sex;
}): {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  flooredAt: number | null;
} {
  const floor = calorieFloor(input.sex);
  const raw = Math.round(input.tdeeKcal - input.deficitKcal);
  const calories = Math.max(raw, floor);
  // Protein-forward for muscle retention on a cut; fat floor for hormones.
  const proteinG = Math.round(input.weightLb * 0.9);
  const fatG = Math.max(Math.round(input.weightLb * 0.3), 40);
  const carbsG = Math.max(
    Math.round((calories - proteinG * 4 - fatG * 9) / 4),
    0,
  );
  return {
    calories,
    proteinG,
    fatG,
    carbsG,
    flooredAt: raw < floor ? floor : null,
  };
}
