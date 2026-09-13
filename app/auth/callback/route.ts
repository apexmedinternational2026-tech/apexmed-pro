import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// One shared endpoint for every Supabase Auth email link this app sends —
// sign-up confirmation and password-recovery alike (see lib/actions/auth.ts)
// — since both are the same PKCE code-exchange operation and differ only
// in where `next` sends the visitor afterward. Not a page: it must run
// before anything renders, and it needs to set the session cookie on the
// response itself.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Expired, already-used, or tampered-with link — send them to sign-in
  // with an explanation rather than a bare redirect into a page that
  // expects a session that was never established.
  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
