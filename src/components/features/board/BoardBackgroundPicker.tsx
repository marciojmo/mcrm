'use client';

import { PaletteIcon } from 'lucide-react';
import { setBoardBackground } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { BOARD_BACKGROUNDS } from '@/constants/boardBackgrounds';
import { useSafeTransition } from '@/hooks/useSafeTransition';

const DEFAULT_BACKGROUND = 'default';

interface BoardBackgroundPickerProps {
  boardId: string;
  background: string | null;
}

export function BoardBackgroundPicker({
  boardId,
  background,
}: BoardBackgroundPickerProps) {
  const { isPending, runAction } = useSafeTransition();

  function select(value: string) {
    const next = value === DEFAULT_BACKGROUND ? null : value;
    if (isPending || next === background) return;
    runAction(() => setBoardBackground(boardId, next));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Fundo do quadro"
            aria-disabled={isPending}
          />
        }
      >
        <PaletteIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Fundo do quadro</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={background ?? DEFAULT_BACKGROUND}
            onValueChange={select}
          >
            <DropdownMenuRadioItem value={DEFAULT_BACKGROUND} closeOnClick>
              <span
                aria-hidden
                className="size-4 rounded-sm border bg-background"
              />
              Padrão
            </DropdownMenuRadioItem>
            {BOARD_BACKGROUNDS.map((option) => (
              <DropdownMenuRadioItem
                key={option.key}
                value={option.key}
                closeOnClick
              >
                <span
                  aria-hidden
                  className="size-4 rounded-sm"
                  style={{ background: option.value }}
                />
                {option.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
