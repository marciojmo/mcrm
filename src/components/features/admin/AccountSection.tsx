import { AccountPasswordForm } from '@/components/features/admin/AccountPasswordForm';
import { AccountProfileForm } from '@/components/features/admin/AccountProfileForm';
import { AccountRoleControl } from '@/components/features/admin/AccountRoleControl';
import { AccountStatusControl } from '@/components/features/admin/AccountStatusControl';
import { UserStatusBadge } from '@/components/features/admin/UserStatusBadge';
import { formatShortDate } from '@/lib/formatShortDate';
import type { AccountUser } from '@/types/accountUser';

interface AccountSectionProps {
  account: AccountUser;
  isCurrentUser: boolean;
}

export function AccountSection({
  account,
  isCurrentUser,
}: AccountSectionProps) {
  return (
    <section aria-labelledby="account-title" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="account-title" className="text-base font-semibold">
          Conta
        </h2>
        <UserStatusBadge isBanned={account.isBanned} />
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Google</dt>
          <dd>{account.isGoogleLinked ? 'Vinculado' : 'Não vinculado'}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Criado em</dt>
          <dd>{formatShortDate(account.createdAt)}</dd>
        </div>
      </dl>
      <AccountProfileForm
        key={`${account.name}|${account.email}`}
        userId={account.id}
        name={account.name}
        email={account.email}
        isGoogleLinked={account.isGoogleLinked}
      />
      <AccountRoleControl
        key={account.role}
        userId={account.id}
        role={account.role}
        isCurrentUser={isCurrentUser}
      />
      <AccountPasswordForm userId={account.id} />
      <AccountStatusControl
        userId={account.id}
        userName={account.name}
        isBanned={account.isBanned}
        isCurrentUser={isCurrentUser}
      />
    </section>
  );
}
