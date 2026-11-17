'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BriefcaseIcon,
  HomeIcon,
  SettingsIcon,
  ShieldIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BoardSummary } from '@/types/board';

const NAV_ITEMS = [
  { href: '/home', label: 'Início', Icon: HomeIcon },
  { href: '/dashboard', label: 'Trabalho', Icon: BriefcaseIcon },
  { href: '/settings', label: 'Configurações', Icon: SettingsIcon },
];

export const NAV_ITEM_CLASS =
  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-muted';
export const NAV_ACTIVE_CLASS =
  'bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent';

interface SidebarProps {
  boards: BoardSummary[];
  isAdmin?: boolean;
}

export function Sidebar({ boards, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-r bg-sidebar p-3">
      <span className="px-2 py-1 font-semibold">MCRM</span>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => (
          <div key={href} className="flex flex-col gap-1">
            <Link
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              className={cn(
                NAV_ITEM_CLASS,
                pathname.startsWith(href) && NAV_ACTIVE_CLASS
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
            {href === '/dashboard' && (
              <div className="ml-4 flex flex-col gap-0.5">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/dashboard/${board.id}`}
                    aria-current={
                      pathname === `/dashboard/${board.id}` ? 'page' : undefined
                    }
                    className={cn(
                      NAV_ITEM_CLASS,
                      'block truncate py-1',
                      pathname === `/dashboard/${board.id}` && NAV_ACTIVE_CLASS
                    )}
                  >
                    {board.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {isAdmin && (
        <Link href="/admin" className={NAV_ITEM_CLASS}>
          <ShieldIcon className="size-4" />
          God mode
        </Link>
      )}
    </aside>
  );
}
