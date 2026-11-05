import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import type { BoardUser } from '@/types/board';

export function UserAvatar({ user }: { user: BoardUser }) {
  return (
    <Avatar size="sm">
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
