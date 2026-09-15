import { getStarterFaqs } from "@/lib/supabase/queries/chatbot";
import { ChatWidget } from "./chat-widget";

/**
 * Server Component wrapper so the starter-question fetch (No raw Supabase
 * queries in components — CLAUDE.md rule 7) happens server-side, with the
 * interactive panel itself staying a Client Component. `.catch(() => [])`
 * rather than letting a fetch failure propagate — the chatbot is a
 * convenience layered on top of the site, not primary content, so it
 * should degrade to "no starter chips" rather than break the page it's
 * mounted on (same fail-open posture as WhatsAppButton's own settings fetch).
 */
export async function ChatWidgetLoader() {
  const starterQuestions = await getStarterFaqs().catch(() => []);
  return <ChatWidget starterQuestions={starterQuestions} />;
}
