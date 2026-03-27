import { type ReactNode } from "react";
import Link from "next/link";

interface Crumb { label: string; href?: string }

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: Crumb[];
}

export default function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-2">
            {breadcrumb.map((c, i) => (
              <span key={i} className="flex items-center gap-1 text-[11.5px] text-ink-4">
                {i > 0 && <span aria-hidden="true" className="mx-0.5">/</span>}
                {c.href ? (
                  <Link href={c.href} className="text-ink-3 hover:text-ink hover:underline transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className={i === breadcrumb.length - 1 ? "text-ink-2" : "text-ink-4"}>
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[22px] font-bold text-ink leading-tight">{title}</h1>
        {description && (
          <p className="text-[13px] text-ink-3 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
