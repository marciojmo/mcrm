'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeftIcon,
  LayoutGridIcon,
  SettingsIcon,
  ShieldIcon,
} from 'lucide-react';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { NAV_ACTIVE_CLASS, NAV_ITEM_CLASS } from '@/components/layouts/Sidebar';
import { cn } from '@/lib/utils';
import type { BoardUser } from '@/types/board';

interface AdminSidebarProps {
  collaborators: BoardUser[];
}

export function AdminSidebar({ collaborators }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 border-r bg-sidebar p-3">
      <span className="flex items-center gap-2 px-2 py-1 font-semibold">
        <ShieldIcon className="size-4 text-primary" />
        God mode
      </span>
      <nav className="flex min-h-0 flex-1 flex-col gap-1">
        <Link
          href="/admin"
          aria-current={pathname === '/admin' ? 'page' : undefined}
          className={cn(
            NAV_ITEM_CLASS,
            pathname === '/admin' && NAV_ACTIVE_CLASS
          )}
        >
          <LayoutGridIcon className="size-4" />
          Visão geral
        </Link>
        <Link
          href="/admin/settings"
          aria-current={pathname === '/admin/settings' ? 'page' : undefined}
          className={cn(
            NAV_ITEM_CLASS,
            pathname === '/admin/settings' && NAV_ACTIVE_CLASS
          )}
        >
          <SettingsIcon className="size-4" />
          Configurações
        </Link>
        <span className="mt-3 px-2 text-xs font-medium text-muted-foreground">
          Colaboradores
        </span>
        <div className="flex min-h-0 flex-col gap-0.5 overflow-y-auto">
          {collaborators.map((collaborator) => {
            const href = `/admin/users/${collaborator.id}`;
            return (
              <Link
                key={collaborator.id}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={cn(
                  NAV_ITEM_CLASS,
                  pathname === href && NAV_ACTIVE_CLASS
                )}
              >
                <UserAvatar user={collaborator} isDecorative />
                <span className="truncate">{collaborator.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <Link href="/home" className={NAV_ITEM_CLASS}>
        <ArrowLeftIcon className="size-4" />
        Voltar ao app
      </Link>
    </aside>
  );
}
