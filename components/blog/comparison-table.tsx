/** MDX shortcode: <ComparisonTable headers={["A", "B"]} rows={[["1", "2"]]} /> */
export function ComparisonTable({ caption, headers, rows }: { caption?: string; headers: string[]; rows: string[][] }) {
  return (
    <figure className="my-2">
      <div className="overflow-x-auto rounded-xl border border-navy-800/10">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="bg-paper-50">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="border-b border-navy-800/15 px-4 py-3 text-caption font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/10">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-body-sm text-ink-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-2 text-caption text-slate-500">{caption}</figcaption>}
    </figure>
  );
}
