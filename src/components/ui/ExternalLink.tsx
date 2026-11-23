interface ExternalLinkProps {
  href: string;
}

export function ExternalLink({ href }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="rounded-sm break-all text-[color-mix(in_oklab,var(--primary),var(--foreground)_20%)] underline underline-offset-4 outline-none hover:decoration-2 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {href}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
