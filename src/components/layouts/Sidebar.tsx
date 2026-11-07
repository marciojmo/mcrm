'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenIcon,
  BriefcaseIcon,
  HomeIcon,
  SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BoardSummary } from '@/types/board';

const NAV_ITEMS = [
  { href: '/home', label: 'Início', Icon: HomeIcon },
  { href: '/dashboard', label: 'Trabalho', Icon: BriefcaseIcon },
  { href: '/wiki', label: 'Wiki', Icon: BookOpenIcon },
  { href: '/settings', label: 'Configurações', Icon: SettingsIcon },
];

interface SidebarProps {
  boards: BoardSummary[];
}

export function Sidebar({ boards }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 border-r bg-muted/40 p-3">
      <span className="px-2 py-1 text-lg font-semibold">MCRM</span>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => (
          <div key={href} className="flex flex-col gap-1">
            <Link
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted',
                pathname.startsWith(href) && 'bg-muted font-medium'
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
            {href === '/dashboard' && (
              <div className="ml-4 flex flex-col gap-1">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/dashboard/${board.id}`}
                    aria-current={
                      pathname === `/dashboard/${board.id}` ? 'page' : undefined
                    }
                    className={cn(
                      'truncate rounded-lg px-2 py-1 text-sm hover:bg-muted',
                      pathname === `/dashboard/${board.id}` &&
                        'bg-muted font-medium'
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
    </aside>
  );
}
