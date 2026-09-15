"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { MessageCircleIcon, CloseIcon, SendIcon } from "@/components/ui/icons";
import type { StarterFaq } from "@/lib/supabase/queries/chatbot";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const SESSION_STORAGE_KEY = "apexmed_chat_session_id";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hi! I can answer common questions about our programs, pathways, and services. Type a question below, or tap one to get started.",
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    // Private browsing / blocked storage — chat still works, the admin
    // log just won't be able to group this visitor's questions together.
    return "";
  }
}

/**
 * Floating chat button + slide-out panel — mounted once in
 * app/(public)/layout.tsx so it's present on every public page, never in
 * the admin panel. Single-turn by design: this isn't backed by an LLM (the
 * client's explicit "offline" choice, see lib/chatbot/match.ts), so each
 * message is answered independently from the curated FAQ table with no
 * real conversational memory — faking multi-turn context here would
 * mislead visitors into expecting reasoning this system doesn't do.
 */
export function ChatWidget({ starterQuestions }: { starterQuestions: StarterFaq[] }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const sessionIdRef = React.useRef<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") setOpen(false);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((previous) => [...previous, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionIdRef.current }),
      });
      const data: { ok: boolean; answer?: string; error?: string } = await response.json();

      const replyText =
        data.answer ??
        (response.status === 429
          ? "You've sent a lot of messages — please wait a moment before trying again."
          : "Something went wrong. Please try again, or use the Contact Us form.");

      setMessages((previous) => [...previous, { id: crypto.randomUUID(), role: "bot", text: replyText }]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "Something went wrong. Please check your connection and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  const showStarters = messages.length === 1 && starterQuestions.length > 0;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="ApexMed chat assistant"
          onKeyDown={handleKeyDown}
          className={cn(
            "fixed bottom-[288px] right-4 z-40 flex h-[65vh] max-h-[440px] w-[calc(100vw-2rem)] max-w-[340px] flex-col overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-xl shadow-black/20",
            "sm:bottom-[248px] sm:right-5",
          )}
        >
          <div className="flex items-center justify-between bg-navy-950 px-4 py-2.5">
            <p className="text-body-sm font-semibold text-paper-50">ApexMed Assistant</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-paper-50/80 hover:bg-white/10 hover:text-paper-50"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 text-body-sm",
                  message.role === "bot"
                    ? "self-start bg-paper-50 text-ink-900"
                    : "self-end bg-navy-950 text-paper-50",
                )}
              >
                {message.text}
              </div>
            ))}

            {sending && (
              <div className="self-start rounded-xl bg-paper-50 px-3.5 py-2.5 text-body-sm text-slate-500">
                Typing…
              </div>
            )}

            {showStarters && (
              <div className="flex flex-col gap-1.5 pt-1">
                {starterQuestions.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => void sendMessage(faq.question)}
                    className="rounded-lg border border-navy-800/15 px-3 py-2 text-left text-body-sm text-ink-900 hover:border-gold-500/50 hover:bg-gold-500/5"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-navy-800/10 p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a question…"
              maxLength={500}
              aria-label="Type a question"
              className="h-10 flex-1 rounded-full border border-navy-800/15 bg-paper-50 px-4 text-body-sm text-ink-900 outline-none focus:border-gold-500/60"
            />
            <button
              type="submit"
              disabled={sending || input.trim().length === 0}
              aria-label="Send"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold-500 text-navy-950 transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        // Stacked directly above the LinkedIn and WhatsApp buttons
        // (components/layout/linkedin-button.tsx, whatsapp-button.tsx),
        // same z-index and the same mobile-vs-sm: size/position split, so
        // all three read as one consistent corner stack rather than
        // fighting for the same spot.
        className="fixed bottom-[224px] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 sm:bottom-[172px] sm:right-5 sm:h-14 sm:w-14"
      >
        {open ? <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircleIcon className="h-6 w-6 sm:h-7 sm:w-7" />}
      </button>
    </>
  );
}
