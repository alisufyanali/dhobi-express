"use client";
import { useRef } from "react";

export function ReplyBox({ action }: { action: (fd: FormData) => Promise<void> }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={async (fd) => { await action(fd); form.current?.reset(); }} className="flex gap-2">
      <input name="text" required autoFocus placeholder="Type your reply…" className="input" />
      <button className="btn-primary">Send</button>
    </form>
  );
}
