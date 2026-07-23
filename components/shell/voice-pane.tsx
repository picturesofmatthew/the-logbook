"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  parseDayDictation,
  type DictationWorkout,
} from "@/lib/engine/dictation";
import {
  commitVoiceDay,
  saveVoiceNote,
  type VoiceFoodInput,
} from "@/app/voice/actions";
import { MEALS, type Meal } from "@/lib/meals";
import type { Hall } from "@/lib/halls";
import { logChime, sealTone } from "@/lib/sounds";
import { MealGlyph } from "@/components/glyphs";

// Web Speech is vendor-prefixed and absent from the TS DOM lib.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechResultEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};
type SpeechCtor = new () => SpeechRecognitionLike;

type Estimate = {
  name: string;
  hall: Hall;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: "high" | "rough";
};

type FoodCard = VoiceFoodInput & { confidence: "high" | "rough" };

type Review = {
  transcript: string;
  foods: FoodCard[];
  workout: DictationWorkout | null;
  rituals: {
    waterCups: number | null;
    weightLb: number | null;
    mood: string;
    note: string;
  };
};

type Phase = "idle" | "recording" | "composing" | "review" | "sealed";

const MAX_SECONDS = 30;

function speechCtor(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const cands = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const c of cands) {
    if (MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const s = String(reader.result);
      resolve(s.slice(s.indexOf(",") + 1)); // strip the data: prefix
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

async function fetchEstimate(line: string): Promise<Estimate | null> {
  try {
    const res = await fetch(`/api/food-estimate?q=${encodeURIComponent(line)}`);
    const d = (await res.json()) as { estimate?: Estimate };
    return d.estimate ?? null;
  } catch {
    return null;
  }
}

// One exercise's sets, folded for display: "185×8 · 185×6".
function foldWorkout(w: DictationWorkout): { ex: string; detail: string }[] {
  const order: string[] = [];
  const by = new Map<string, string[]>();
  for (const s of w.sets) {
    if (!by.has(s.exercise)) {
      by.set(s.exercise, []);
      order.push(s.exercise);
    }
    by.get(s.exercise)!.push(
      s.kind === "cardio"
        ? `${s.minutes} min`
        : s.weightLb != null
          ? `${s.weightLb}×${s.reps}`
          : `bw×${s.reps}`,
    );
  }
  return order.map((ex) => ({ ex, detail: by.get(ex)!.join(" · ") }));
}

export function VoicePane({
  day,
  active,
  flash,
  onClose,
}: {
  day: string | null;
  active: boolean;
  flash: (m: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [typed, setTyped] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [sealing, setSealing] = useState(false);
  const [sealedMsg, setSealedMsg] = useState("");

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<{ blob: Blob; mime: string; durationS: number } | null>(null);
  const transcriptRef = useRef("");
  const interimRef = useRef("");
  const elapsedRef = useRef(0);
  const countdownRef = useRef<number | null>(null);
  const hardStopRef = useRef<number | null>(null);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    setSupported(speechCtor() != null);
  }, []);

  const teardownMic = useCallback(() => {
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (hardStopRef.current) window.clearTimeout(hardStopRef.current);
    countdownRef.current = null;
    hardStopRef.current = null;
    try {
      recRef.current?.stop();
    } catch {
      /* already stopped */
    }
    try {
      if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
    } catch {
      /* already stopped */
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const reset = useCallback(() => {
    teardownMic();
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setInterim("");
    setTyped("");
    setReview(null);
    setSealedMsg("");
    audioRef.current = null;
    transcriptRef.current = "";
    interimRef.current = "";
    elapsedRef.current = 0;
  }, [teardownMic]);

  // Stop the mic and wipe state whenever the pane is hidden (sheet closed or a
  // different tab) — never leave a hot mic.
  useEffect(() => {
    if (!active) reset();
  }, [active, reset]);
  useEffect(() => () => teardownMic(), [teardownMic]);

  const buildReview = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text) {
      flash("Nothing to read yet.");
      setPhase("idle");
      return;
    }
    setPhase("composing");
    const parsed = parseDayDictation(text, { hour: new Date().getHours() });
    const foods: FoodCard[] = await Promise.all(
      parsed.foods.map(async (f) => {
        const est = await fetchEstimate(f.line);
        if (est) {
          return {
            meal: f.meal,
            name: est.name,
            hall: est.hall,
            icon: est.icon,
            servingLabel: est.servingLabel,
            calories: est.calories,
            proteinG: est.proteinG,
            carbsG: est.carbsG,
            fatG: est.fatG,
            estimated: true,
            servings: 1,
            confidence: est.confidence,
          };
        }
        return {
          meal: f.meal,
          name: capitalize(f.line),
          hall: "dishes" as Hall,
          icon: "🍽",
          servingLabel: "your serving",
          calories: 0,
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
          estimated: true,
          servings: 1,
          confidence: "rough" as const,
        };
      }),
    );
    setReview({
      transcript: text,
      foods,
      workout: parsed.workout,
      rituals: {
        waterCups: parsed.rituals.waterCups,
        weightLb: parsed.rituals.weightLb,
        mood: parsed.rituals.mood ?? "",
        note: parsed.note ?? "",
      },
    });
    setPhase("review");
  }, [flash]);

  const stop = useCallback(() => {
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (hardStopRef.current) window.clearTimeout(hardStopRef.current);
    countdownRef.current = null;
    hardStopRef.current = null;
    try {
      recRef.current?.stop();
    } catch {
      /* already stopped */
    }
    const finalize = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const full = `${transcriptRef.current} ${interimRef.current}`.trim();
      void buildReview(full);
    };
    const mr = mrRef.current;
    if (mr && mr.state !== "inactive") {
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: (mr.mimeType || "audio/webm").split(";")[0],
        });
        audioRef.current = { blob, mime: blob.type, durationS: elapsedRef.current };
        finalize();
      };
      try {
        mr.stop();
      } catch {
        finalize();
      }
    } else {
      finalize();
    }
  }, [buildReview]);
  stopRef.current = stop;

  const start = useCallback(async () => {
    const Ctor = speechCtor();
    if (!Ctor) {
      flash("Speak isn't supported here — type your day instead.");
      return;
    }
    setTranscript("");
    setInterim("");
    transcriptRef.current = "";
    interimRef.current = "";
    elapsedRef.current = 0;
    setSeconds(0);
    chunksRef.current = [];
    audioRef.current = null;

    // Audio clip (best effort — transcription still works if the mic clip fails).
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const mr = new MediaRecorder(
        stream,
        mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : undefined,
      );
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mrRef.current = mr;
      mr.start();
    } catch {
      /* mic denied — carry on with transcription only */
    }

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let fin = "";
      let int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t;
        else int += t;
      }
      if (fin) {
        transcriptRef.current = `${transcriptRef.current} ${fin}`.trim();
        setTranscript(transcriptRef.current);
      }
      interimRef.current = int;
      setInterim(int);
    };
    rec.onerror = () => {};
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      /* a stale session — ignore */
    }

    setPhase("recording");
    countdownRef.current = window.setInterval(() => {
      elapsedRef.current += 1;
      setSeconds(elapsedRef.current);
    }, 1000);
    hardStopRef.current = window.setTimeout(() => stopRef.current(), MAX_SECONDS * 1000);
  }, [flash]);

  const seal = useCallback(async () => {
    if (!review || !day) {
      flash(day ? "Nothing to seal yet." : "One moment…");
      return;
    }
    setSealing(true);
    const input = {
      day,
      foods: review.foods.map((f) => ({
        meal: f.meal,
        name: f.name,
        hall: f.hall,
        icon: f.icon,
        servingLabel: f.servingLabel,
        calories: Number(f.calories) || 0,
        proteinG: Number(f.proteinG) || 0,
        carbsG: Number(f.carbsG) || 0,
        fatG: Number(f.fatG) || 0,
        estimated: f.estimated,
        servings: f.servings > 0 ? f.servings : 1,
      })),
      workout: review.workout
        ? { title: review.workout.title, sets: review.workout.sets }
        : null,
      rituals: {
        waterCups: review.rituals.waterCups,
        weightLb: review.rituals.weightLb,
        mood: review.rituals.mood.trim() || null,
        note: review.rituals.note.trim() || null,
      },
    };
    const res = await commitVoiceDay(input);

    // Keep the voice note for the partner (best effort, and only if we caught audio).
    if (audioRef.current) {
      try {
        const b64 = await blobToBase64(audioRef.current.blob);
        await saveVoiceNote({
          day,
          audioBase64: b64,
          mime: audioRef.current.mime.split(";")[0],
          transcript: review.transcript,
          durationS: audioRef.current.durationS,
        });
      } catch {
        /* the day still sealed; the note just didn't keep */
      }
    }
    setSealing(false);

    const landed = res.counts.foods + res.counts.sets + res.counts.rituals;
    if (res.error && landed === 0) {
      flash(res.error);
      return;
    }
    sealTone();
    const parts: string[] = [];
    if (res.counts.foods) parts.push(`${res.counts.foods} logged`);
    if (res.counts.sets) parts.push(`${res.counts.sets} sets`);
    if (res.counts.rituals) parts.push(`${res.counts.rituals} rituals`);
    if (audioRef.current) parts.push("a voice note");
    setSealedMsg(parts.length ? parts.join(" · ") : "your day");
    setPhase("sealed");
    router.refresh();
  }, [review, day, flash, router]);

  // ── Render ──

  const label = "font-display text-[10px] tracking-wide text-ink-soft";

  if (phase === "sealed") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-3xl">🔮</span>
        <p className="font-display text-sm text-moss-deep">the day is sealed</p>
        <p className="text-xs text-ink-soft">{sealedMsg}</p>
        <button
          type="button"
          onClick={onClose}
          className="wobbly-sm mt-2 cursor-pointer border-2 border-moss-deep bg-moss px-6 py-2 text-sm text-cream"
        >
          done
        </button>
      </div>
    );
  }

  if (phase === "composing") {
    return (
      <p className="py-8 text-center text-sm text-ink-soft">composing your day…</p>
    );
  }

  if (phase === "review" && review) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className={label}>WHAT I HEARD · edit anything before you seal</p>
          <textarea
            value={review.transcript}
            onChange={(e) =>
              setReview((r) => (r ? { ...r, transcript: e.target.value } : r))
            }
            rows={2}
            className="wobbly-sm w-full resize-none border-2 border-ink/25 bg-cream px-2 py-1.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => buildReview(review.transcript)}
            className="self-start cursor-pointer text-xs text-ink-soft underline decoration-dotted"
          >
            re-read
          </button>
        </div>

        {review.foods.map((f, i) => (
          <div
            key={i}
            className="wobbly-sm flex flex-col gap-2 border-2 border-dashed border-gold/70 bg-gold-soft/30 p-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-base text-terracotta" title="an estimate">
                ~
              </span>
              <input
                value={f.name}
                onChange={(e) =>
                  setReview((r) =>
                    r
                      ? {
                          ...r,
                          foods: r.foods.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        }
                      : r,
                  )
                }
                className="wobbly-sm min-w-0 flex-1 border-2 border-ink/25 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
              />
              <button
                type="button"
                aria-label="remove"
                onClick={() =>
                  setReview((r) =>
                    r ? { ...r, foods: r.foods.filter((_, j) => j !== i) } : r,
                  )
                }
                className="cursor-pointer px-1 text-sm text-ink-soft"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-1">
              {MEALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    setReview((r) =>
                      r
                        ? {
                            ...r,
                            foods: r.foods.map((x, j) =>
                              j === i ? { ...x, meal: m.id } : x,
                            ),
                          }
                        : r,
                    )
                  }
                  className={`wobbly-sm flex flex-1 items-center justify-center gap-1 cursor-pointer border-2 px-1 py-1 text-[11px] ${
                    f.meal === m.id
                      ? "border-gold bg-gold-soft"
                      : "border-ink/20 bg-cream text-ink-soft"
                  }`}
                >
                  <MealGlyph meal={m.id} size={11} /> {m.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ["KCAL", "calories"],
                  ["P", "proteinG"],
                  ["C", "carbsG"],
                  ["F", "fatG"],
                ] as const
              ).map(([lbl, key]) => (
                <label key={key} className="flex flex-col gap-0.5">
                  <span className="font-display text-[9px] tracking-wide text-ink-soft">
                    {lbl}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={f[key]}
                    onChange={(e) =>
                      setReview((r) =>
                        r
                          ? {
                              ...r,
                              foods: r.foods.map((x, j) =>
                                j === i
                                  ? {
                                      ...x,
                                      [key]:
                                        e.target.value === ""
                                          ? 0
                                          : Number(e.target.value),
                                    }
                                  : x,
                              ),
                            }
                          : r,
                      )
                    }
                    className="wobbly-sm border-2 border-ink/25 bg-cream px-1 py-1 text-center text-sm outline-none focus:border-gold"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        {review.workout ? (
          <div className="wobbly-sm flex flex-col gap-2 border-2 border-gold/60 bg-gold-soft/30 p-3">
            <div className="flex items-center gap-2">
              <input
                value={review.workout.title}
                onChange={(e) =>
                  setReview((r) =>
                    r && r.workout
                      ? { ...r, workout: { ...r.workout, title: e.target.value } }
                      : r,
                  )
                }
                className="wobbly-sm min-w-0 flex-1 border-2 border-ink/25 bg-cream px-2 py-1 font-display text-xs outline-none focus:border-gold"
              />
              <button
                type="button"
                aria-label="remove workout"
                onClick={() => setReview((r) => (r ? { ...r, workout: null } : r))}
                className="cursor-pointer px-1 text-sm text-ink-soft"
              >
                ✕
              </button>
            </div>
            {foldWorkout(review.workout).map((line) => (
              <p key={line.ex} className="text-xs text-ink-soft">
                <span className="text-ink">{line.ex}</span> — {line.detail}
              </p>
            ))}
          </div>
        ) : null}

        <div className="wobbly-sm flex flex-col gap-2 border-2 border-ink/20 bg-cream p-3">
          <p className={label}>THE DAY&apos;S RITUALS</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-16 text-ink-soft">water</span>
            <button
              type="button"
              onClick={() =>
                setReview((r) =>
                  r
                    ? {
                        ...r,
                        rituals: {
                          ...r.rituals,
                          waterCups: Math.max(0, (r.rituals.waterCups ?? 0) - 1),
                        },
                      }
                    : r,
                )
              }
              className="wobbly-sm h-7 w-7 cursor-pointer border-2 border-ink/25"
            >
              −
            </button>
            <span className="w-6 text-center">{review.rituals.waterCups ?? 0}</span>
            <button
              type="button"
              onClick={() =>
                setReview((r) =>
                  r
                    ? {
                        ...r,
                        rituals: {
                          ...r.rituals,
                          waterCups: Math.min(20, (r.rituals.waterCups ?? 0) + 1),
                        },
                      }
                    : r,
                )
              }
              className="wobbly-sm h-7 w-7 cursor-pointer border-2 border-ink/25"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-16 text-ink-soft">weight</span>
            <input
              type="number"
              inputMode="decimal"
              value={review.rituals.weightLb ?? ""}
              placeholder="—"
              onChange={(e) =>
                setReview((r) =>
                  r
                    ? {
                        ...r,
                        rituals: {
                          ...r.rituals,
                          weightLb: e.target.value === "" ? null : Number(e.target.value),
                        },
                      }
                    : r,
                )
              }
              className="wobbly-sm w-24 border-2 border-ink/25 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
            />
            <span className="text-xs text-ink-soft">lb</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-16 text-ink-soft">mood</span>
            <input
              value={review.rituals.mood}
              maxLength={8}
              placeholder="—"
              onChange={(e) =>
                setReview((r) =>
                  r ? { ...r, rituals: { ...r.rituals, mood: e.target.value } } : r,
                )
              }
              className="wobbly-sm w-28 border-2 border-ink/25 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
            />
          </div>
          <textarea
            value={review.rituals.note}
            maxLength={240}
            placeholder="a line for the journal…"
            rows={2}
            onChange={(e) =>
              setReview((r) =>
                r ? { ...r, rituals: { ...r.rituals, note: e.target.value } } : r,
              )
            }
            className="wobbly-sm w-full resize-none border-2 border-ink/25 bg-cream px-2 py-1.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <button
          type="button"
          disabled={sealing || !day}
          onClick={seal}
          className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss py-2.5 font-display text-sm text-cream disabled:opacity-60"
        >
          {sealing ? "sealing…" : "seal the day"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer text-center text-xs text-ink-soft underline decoration-dotted"
        >
          start over
        </button>
      </div>
    );
  }

  // idle / recording
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {supported !== false ? (
        <>
          {phase === "recording" ? (
            <>
              <button
                type="button"
                onClick={stop}
                className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-terracotta bg-terracotta text-cream"
                aria-label="Stop"
              >
                <span className="font-display text-lg">{MAX_SECONDS - seconds}s</span>
              </button>
              <p className="min-h-[2.5rem] px-2 text-center text-sm text-ink-soft">
                {transcript} <span className="text-ink/40">{interim}</span>
              </p>
              <button
                type="button"
                onClick={stop}
                className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss px-6 py-2 text-sm text-cream"
              >
                done — read it back
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={start}
                className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-moss-deep bg-moss text-cream"
                aria-label="Speak your day"
              >
                <span className="text-3xl">🎙</span>
              </button>
              <p className="px-4 text-center text-sm text-ink-soft">
                Speak your whole day — what you ate, your workout, water, weight,
                how you felt. It composes into the seal.
              </p>
            </>
          )}
        </>
      ) : null}

      <details className="w-full">
        <summary className="cursor-pointer text-center text-xs text-ink-soft underline decoration-dotted">
          {supported === false ? "type your day" : "or type it instead"}
        </summary>
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            rows={3}
            placeholder="two eggs and toast for breakfast, benched 135 for 5, drank three waters, feeling good, weighed 172"
            className="wobbly-sm w-full resize-none border-2 border-ink/30 bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => buildReview(typed)}
            className="wobbly-sm cursor-pointer border-2 border-terracotta bg-terracotta py-2 font-display text-xs text-cream"
          >
            read my day
          </button>
        </div>
      </details>

      <p className="px-4 text-center text-[10px] leading-snug text-ink/40">
        Speaking sends your words to your browser&apos;s speech service to turn
        them into text.
      </p>
    </div>
  );
}
