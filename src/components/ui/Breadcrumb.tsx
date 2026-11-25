import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

interface BreadcrumbLink {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  links?: BreadcrumbLink[];
  children: React.ReactNode;
}

export function Breadcrumb({ links = [], children }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Caminho"
      className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground"
    >
      {links.map((link) => (
        <Fragment key={link.href}>
          <Link
            href={link.href}
            className="rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {link.label}
          </Link>
          <ChevronRightIcon className="size-4 shrink-0" />
        </Fragment>
      ))}
      {children}
    </nav>
  );
}
