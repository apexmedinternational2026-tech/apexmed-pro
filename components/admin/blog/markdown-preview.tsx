import React from "react";

// A deliberately small Markdown-subset renderer for the live preview pane,
// not a full MDX pipeline — real MDX (arbitrary embedded JSX/React
// components) would need a compile step (next-mdx-remote or mdx-bundler)
// that isn't safe or fast enough to run on every keystroke client-side.
// What's stored in body_mdx is untouched, full MDX text; this is only a
// best-effort visual approximation of the common-Markdown parts of it —
// headings, emphasis, links, lists, code — rendered as real React
// elements (never dangerouslySetInnerHTML), so there's no injection
// surface even though the input is admin-authored, not user-authored.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `${keyPrefix}-${index++}`;

    if (match[2] !== undefined) nodes.push(<strong key={key}>{match[2]}</strong>);
    else if (match[3] !== undefined) nodes.push(<em key={key}>{match[3]}</em>);
    else if (match[4] !== undefined)
      nodes.push(
        <code key={key} className="rounded bg-navy-950/5 px-1 py-0.5 text-caption">
          {match[4]}
        </code>,
      );
    else if (match[5] !== undefined) {
      nodes.push(
        <a key={key} href={match[6]} className="text-navy-950 underline" target="_blank" rel="noreferrer">
          {match[5]}
        </a>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function MarkdownPreview({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] | null = null;

  function flushList(key: string) {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5">
        {listBuffer.map((item, index) => (
          <li key={index}>{renderInline(item, `${key}-li-${index}`)}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  }

  lines.forEach((line, index) => {
    const key = `b-${index}`;

    if (line.trim().startsWith("```")) {
      if (codeBuffer === null) {
        codeBuffer = [];
      } else {
        blocks.push(
          <pre key={key} className="overflow-x-auto rounded-lg bg-navy-950 p-3 text-caption text-paper-50">
            <code>{codeBuffer.join("\n")}</code>
          </pre>,
        );
        codeBuffer = null;
      }
      return;
    }

    if (codeBuffer !== null) {
      codeBuffer.push(line);
      return;
    }

    const heading = /^(#{1,3})\s+(.*)/.exec(line);
    if (heading) {
      flushList(key);
      const level = (heading[1] ?? "").length;
      const text = heading[2] ?? "";
      if (level === 1)
        blocks.push(
          <h1 key={key} className="font-display text-display-md text-ink-900">
            {text}
          </h1>,
        );
      else if (level === 2)
        blocks.push(
          <h2 key={key} className="font-display text-display-sm text-ink-900">
            {text}
          </h2>,
        );
      else
        blocks.push(
          <h3 key={key} className="font-display text-body-lg font-semibold text-ink-900">
            {text}
          </h3>,
        );
      return;
    }

    const listItem = /^[-*]\s+(.*)/.exec(line);
    if (listItem) {
      listBuffer.push(listItem[1] ?? "");
      return;
    }

    flushList(key);

    if (line.trim() === "") return;

    blocks.push(
      <p key={key} className="text-body-md text-ink-900">
        {renderInline(line, key)}
      </p>,
    );
  });

  flushList("tail");

  return <div className="flex flex-col gap-3">{blocks}</div>;
}
