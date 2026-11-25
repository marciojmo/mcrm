import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface AdminPageProps {
  title: string;
  parent?: { label: string; href: string };
  children: React.ReactNode;
}

export function AdminPage({ title, parent, children }: AdminPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Breadcrumb links={parent && [parent]}>
        <h1
          aria-current="page"
          className="truncate font-medium text-foreground"
        >
          {title}
        </h1>
      </Breadcrumb>
      {children}
    </div>
  );
}
