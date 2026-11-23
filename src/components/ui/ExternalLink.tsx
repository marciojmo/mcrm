interface ExternalLinkProps {
  href: string;
}

export function ExternalLink({ href }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="rounded-sm break-all text-primary underline underline-offset-4 outline-none hover:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {href}
    </a>
  );
}
