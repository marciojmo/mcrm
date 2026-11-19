import type { ComponentProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import type { BoardUser } from '@/types/board';

interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user: BoardUser;
  isDecorative?: boolean;
}

export function UserAvatar({
  user,
  isDecorative = false,
  ...props
}: UserAvatarProps) {
  const accessibleProps = isDecorative
    ? { 'aria-hidden': true }
    : { title: user.name, role: 'img', 'aria-label': user.name };

  return (
    <Avatar size="sm" {...accessibleProps} {...props}>
      <AvatarImage
        src={user.image ?? undefined}
        alt={isDecorative ? '' : user.name}
      />
      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
