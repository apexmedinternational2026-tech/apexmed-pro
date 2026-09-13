"use client";

import * as React from "react";
import { updateSettingsAction } from "@/lib/actions/admin/settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [status, setStatus] = React.useState<{ type: "idle" | "saving" | "saved" | "error"; message?: string }>({
    type: "idle",
  });

  async function handleSubmit(formData: FormData) {
    setStatus({ type: "saving" });
    const result = await updateSettingsAction(formData);
    setStatus(result.ok ? { type: "saved" } : { type: "error", message: result.error });
  }

  return (
    <form action={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_email">Contact email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          defaultValue={settings.contact_email ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_whatsapp_number">WhatsApp number</Label>
        <Input
          id="contact_whatsapp_number"
          name="contact_whatsapp_number"
          defaultValue={settings.contact_whatsapp_number ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website_url">Website URL</Label>
        <Input id="website_url" name="website_url" defaultValue={settings.website_url ?? ""} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="social_facebook_url">Facebook URL</Label>
        <Input id="social_facebook_url" name="social_facebook_url" defaultValue={settings.social_facebook_url ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="social_instagram_url">Instagram URL</Label>
        <Input
          id="social_instagram_url"
          name="social_instagram_url"
          defaultValue={settings.social_instagram_url ?? ""}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="social_linkedin_url">LinkedIn URL</Label>
        <Input id="social_linkedin_url" name="social_linkedin_url" defaultValue={settings.social_linkedin_url ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="social_youtube_url">YouTube URL</Label>
        <Input id="social_youtube_url" name="social_youtube_url" defaultValue={settings.social_youtube_url ?? ""} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={status.type === "saving"}>
          {status.type === "saving" ? "Saving…" : "Save settings"}
        </Button>
        {status.type === "saved" && <p className="text-body-sm text-slate-500">Saved — live on the site now.</p>}
        {status.type === "error" && <p className="text-body-sm text-error">{status.message}</p>}
      </div>
    </form>
  );
}
