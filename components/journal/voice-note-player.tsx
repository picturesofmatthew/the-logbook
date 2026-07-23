"use client";

// A kept voice note — playable, downloadable, and gone tomorrow night. Used for
// the partner's daily note (accountability) and your own (save it before it
// fades). The audio arrives as a server-decrypted data URI; nothing streams.
export function VoiceNotePlayer({
  dataUri,
  downloadName,
  mine,
}: {
  dataUri: string;
  downloadName: string;
  mine?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm" aria-hidden>
        🎙
      </span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls src={dataUri} preload="none" className="h-8 min-w-0 flex-1" />
      <a
        href={dataUri}
        download={downloadName}
        className="cursor-pointer text-[11px] text-ink-soft underline decoration-dotted"
      >
        save
      </a>
      <span className="w-full text-[10px] italic text-ink/40">
        {mine ? "your note today — " : ""}fades tomorrow night
      </span>
    </div>
  );
}
