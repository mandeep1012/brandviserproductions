import Link from 'next/link';

export function Breadcrumbs({ items }: { items: Array<{ href?: string; label: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="gutter py-4">
      <ol className="eyebrow flex flex-wrap gap-2 text-slate">
        {items.map((item, index) => (
          <li key={item.label} className="flex gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-slate hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
