import type { ServiceMatrix as Matrix } from '@brandviserproductions/contracts';

/** "What each event type draws on": a table on desktop, tag cards on mobile. */
export function ServiceMatrix({ matrix }: { matrix: Matrix }) {
  const label = new Map(matrix.services.map((s) => [s.slug, s.shortName]));
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full border-collapse border-t border-ink text-[15px]">
          <caption className="sr-only">Services typically included for each event type</caption>
          <thead>
            <tr>
              <th scope="col" className="eyebrow border-b border-rule p-4 text-left font-medium text-slate">
                Event type
              </th>
              {matrix.services.map((service) => (
                <th key={service.slug} scope="col" className="eyebrow border-b border-rule p-4 text-center font-medium text-slate">
                  {service.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.eventType}>
                <th scope="row" className="border-b border-rule p-4 text-left font-semibold">
                  {row.label}
                </th>
                {matrix.services.map((service) => {
                  const included = row.serviceSlugs.includes(service.slug);
                  return (
                    <td key={service.slug} className="border-b border-rule p-4 text-center">
                      {included ? (
                        <>
                          <span aria-hidden="true">●</span>
                          <span className="sr-only">Included</span>
                        </>
                      ) : (
                        <span className="sr-only">Not typically included</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-small mt-3 text-slate">● = typically included. Every brief gets its own mix.</p>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {matrix.rows.map((row) => (
          <li key={row.eventType} className="rounded-md border border-rule bg-card p-4">
            <p className="mb-2 font-semibold">{row.label}</p>
            <ul className="flex flex-wrap gap-1.5">
              {row.serviceSlugs.map((slug) => (
                <li key={slug} className="eyebrow rounded-sm border border-rule px-2 py-1 tracking-[0.04em] text-ink">
                  {label.get(slug)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
