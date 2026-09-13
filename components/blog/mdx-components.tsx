import * as React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { slugifyHeading } from "@/lib/toc";
import { Callout } from "./callout";
import { Checklist } from "./checklist";
import { ComparisonTable } from "./comparison-table";
import { CtaBlock } from "./cta-block";

// Flattens a heading's rendered children back to plain text so its id can
// be computed with the exact same slugifyHeading() the TOC sidebar uses
// on the raw source — see lib/toc.ts for why these two have to agree.
function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return getTextContent(node.props.children);
  return "";
}

function Heading({ level, children, ...props }: { level: 2 | 3; children: React.ReactNode }) {
  const id = slugifyHeading(getTextContent(children));
  const Tag = level === 2 ? "h2" : "h3";
  const className =
    level === 2
      ? "mt-10 scroll-mt-28 font-display text-display-sm text-ink-900"
      : "mt-8 scroll-mt-28 font-display text-body-lg font-semibold text-ink-900";

  return (
    <Tag id={id} className={className} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Passed to <MDXRemote components={mdxComponents}> — every tag an editor
 * can use inside body_mdx, whether that's a plain Markdown element
 * (styled to match the design system) or one of the four required custom
 * shortcodes (Callout, Checklist, ComparisonTable, CtaBlock).
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  p: (props) => <p className="text-body-md leading-relaxed text-ink-900" {...props} />,
  a: ({ href = "", ...props }) => {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className="font-medium text-navy-950 underline decoration-navy-800/30 underline-offset-2 hover:decoration-navy-950"
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      />
    );
  },
  ul: (props) => <ul className="ml-5 list-disc space-y-1.5 text-body-md text-ink-900" {...props} />,
  ol: (props) => <ol className="ml-5 list-decimal space-y-1.5 text-body-md text-ink-900" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-navy-800/20 pl-4 text-body-md italic text-slate-500" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-ink-900" {...props} />,
  hr: () => <hr className="my-8 border-navy-800/10" />,
  code: (props) => (
    <code className="rounded bg-navy-950/5 px-1.5 py-0.5 font-mono text-[0.85em] text-ink-900" {...props} />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-xl bg-navy-950 p-4 text-body-sm text-paper-50 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-paper-50"
      {...props}
    />
  ),
  table: (props) => (
    <div className="overflow-x-auto rounded-xl border border-navy-800/10">
      <table className="w-full min-w-[480px] border-collapse text-left" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-paper-50" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-navy-800/10" {...props} />,
  th: (props) => (
    <th
      scope="col"
      className="border-b border-navy-800/15 px-4 py-3 text-caption font-semibold uppercase tracking-wide text-slate-500"
      {...props}
    />
  ),
  td: (props) => <td className="px-4 py-3 text-body-sm text-ink-900" {...props} />,
  img: ({ alt = "", ...props }) => (
    // A Markdown image embedded inline in a post body has no known width/
    // height at render time — unlike cover_image_url (always the admin's
    // cropped 1200x630 upload, sized explicitly via next/image everywhere
    // else in this app), this could be any file an author links to. The
    // fixed 16:9 box below doesn't eliminate layout shift for an image
    // that isn't actually 16:9, but it bounds it to a small, predictable
    // amount instead of the full image height snapping in from nothing.
    // No seeded post embeds an inline image today (only cover_image_url),
    // so this path is unexercised by real content.
    // eslint-disable-next-line @next/next/no-img-element -- next/image needs known dimensions or a sized `fill` parent; neither is available for an arbitrary author-supplied URL.
    <img alt={alt} className="aspect-video w-full rounded-xl border border-navy-800/10 object-cover" {...props} />
  ),
  Callout,
  Checklist,
  ComparisonTable,
  CtaBlock,
};
