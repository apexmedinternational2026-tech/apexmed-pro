"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MarkdownPreview } from "./markdown-preview";

export function MdxEditor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>
        Body (MDX) <span className="text-error">*</span>
      </Label>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={20}
          required
          className="font-mono text-body-sm"
          placeholder="## Heading&#10;&#10;Write your post in MDX…"
        />
        <div className="rounded-md border border-navy-800/30 bg-white p-4">
          <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
          {value.trim() ? (
            <MarkdownPreview source={value} />
          ) : (
            <p className="text-body-sm text-slate-500">Start typing to see a preview.</p>
          )}
        </div>
      </div>
      <p className="text-caption text-slate-500">
        Preview approximates common Markdown (headings, emphasis, links, lists, code) — embedded JSX components
        aren&apos;t executed here, only on the published page.
      </p>
    </div>
  );
}
