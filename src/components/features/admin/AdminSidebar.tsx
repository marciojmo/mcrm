'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeftIcon,
  ChartColumnIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from 'lucide-react';
import { NAV_ACTIVE_CLASS, NAV_ITEM_CLASS } from '@/components/layouts/Sidebar';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/metrics', label: 'Métricas', icon: ChartColumnIcon },
  { href: '/admin/users', label: 'Usuários', icon: UsersIcon },
  { href: '/admin/settings', label: 'Configurações', icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 border-r bg-sidebar p-3">
      <span className="flex items-center gap-2 px-2 py-1 font-semibold">
        <ShieldIcon className="size-4 text-primary" />
        God mode
      </span>
      <nav className="flex min-h-0 flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isCurrent = pathname === href;
          const isActive = isCurrent || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(NAV_ITEM_CLASS, isActive && NAV_ACTIVE_CLASS)}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <Link href="/home" className={NAV_ITEM_CLASS}>
        <ArrowLeftIcon className="size-4" />
        Voltar ao app
      </Link>
    </aside>
  );
}
