"use client";

import * as React from "react";
import Image from "next/image";
import { uploadCoverImageAction } from "@/lib/actions/admin/blog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

export function CoverImageUpload({ defaultUrl, defaultAlt }: { defaultUrl: string; defaultAlt: string }) {
  const [url, setUrl] = React.useState(defaultUrl);
  const [alt, setAlt] = React.useState(defaultAlt);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touchedAlt, setTouchedAlt] = React.useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadCoverImageAction(formData);

    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setUrl(result.value);
  }

  const altMissing = Boolean(url) && touchedAlt && alt.trim().length === 0;

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="cover-image-file">Cover image</Label>

      <input type="hidden" name="cover_image_url" value={url} />

      {url && (
        <div className="relative aspect-[1200/630] w-full max-w-sm overflow-hidden rounded-lg border border-navy-800/10 bg-paper-50">
          <Image src={url} alt="" fill sizes="384px" className="object-cover" />
        </div>
      )}

      <Input id="cover-image-file" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p className="text-body-sm text-slate-500">Uploading…</p>}
      {error && <p className="text-body-sm text-error">{error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cover_image_alt">
          Cover image alt text <span className="text-error">*</span>
        </Label>
        <Input
          id="cover_image_alt"
          name="cover_image_alt"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          onBlur={() => setTouchedAlt(true)}
          aria-invalid={altMissing}
          required
        />
        <FieldError>{altMissing ? "Alt text is required for the cover image." : undefined}</FieldError>
        <p className="text-caption text-slate-500">
          Describes the image for screen readers — required whenever a cover image is set.
        </p>
      </div>
    </div>
  );
}
