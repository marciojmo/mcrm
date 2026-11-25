'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { authClient } from '@/lib/authClient';

interface UserMenuProps {
  name: string;
  email: string;
  image: string | null;
  isGoogleLinked: boolean;
}

export function UserMenu({
  name,
  email,
  image,
  isGoogleLinked,
}: UserMenuProps) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push('/');
  }

  function linkGoogle() {
    authClient.linkSocial({
      provider: 'google',
      callbackURL: window.location.pathname,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu do usuário"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {name}
            <span className="block text-xs font-normal">{email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isGoogleLinked} onClick={linkGoogle}>
          {isGoogleLinked ? 'Conta Google vinculada' : 'Vincular conta Google'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
