import type { ComponentProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import type { BoardUser } from '@/types/board';

interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user: BoardUser;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar
      size="sm"
      title={user.name}
      role="img"
      aria-label={user.name}
      {...props}
    >
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
