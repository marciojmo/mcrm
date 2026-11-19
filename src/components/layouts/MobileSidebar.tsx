'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { SidebarNav } from '@/components/layouts/Sidebar';
import type { BoardSummary } from '@/types/board';

interface MobileSidebarProps {
  boards: BoardSummary[];
  isAdmin?: boolean;
}

export function MobileSidebar({ boards, isAdmin = false }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="mr-auto md:hidden"
            aria-label="Abrir menu"
          />
        }
      >
        <MenuIcon />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-full w-64 max-w-[80vw] translate-x-0 translate-y-0 flex-col gap-4 rounded-none bg-sidebar p-3 sm:max-w-[80vw]"
      >
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SidebarNav
          boards={boards}
          isAdmin={isAdmin}
          onNavigate={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
