'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { useToast } from '@/components/ui/Toast';
import { authClient } from '@/lib/authClient';

const LINKED_PARAM = 'linked';
const LINK_ERROR_PARAM = 'linkError';

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
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has(LINKED_PARAM))
      toast.add({ title: 'Conta Google vinculada.' });
    else if (params.has(LINK_ERROR_PARAM))
      toast.add({
        title:
          'Não foi possível vincular. Use uma conta Google com o mesmo e-mail do seu cadastro.',
        priority: 'high',
      });
    else return;
    router.replace(pathname);
  }, [pathname, router, toast]);

  async function signOut() {
    await authClient.signOut();
    router.push('/');
  }

  function linkGoogle() {
    authClient.linkSocial({
      provider: 'google',
      callbackURL: `${pathname}?${LINKED_PARAM}=1`,
      errorCallbackURL: `${pathname}?${LINK_ERROR_PARAM}=1`,
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
