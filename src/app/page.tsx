import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { EmailSignInForm } from '@/components/features/auth/EmailSignInForm';
import { GoogleSignInButton } from '@/components/features/auth/GoogleSignInButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { getAppName } from '@/services/appSettingService';
import { getSession } from '@/services/sessionService';

const ACCOUNT_NOT_LINKED_ERROR = 'account_not_linked';
const SIGN_UP_DISABLED_ERROR = 'signup_disabled';

async function SignInError({
  searchParams,
}: {
  searchParams: PageProps<'/'>['searchParams'];
}) {
  const { error } = await searchParams;
  if (!error) return null;
  if (error === SIGN_UP_DISABLED_ERROR) redirect('/unauthorized');
  return (
    <p role="alert" className="text-sm text-destructive">
      {error === ACCOUNT_NOT_LINKED_ERROR
        ? 'Esta conta já existe com senha. Entre com e-mail e senha e vincule o Google pelo menu do usuário.'
        : 'Não foi possível entrar com o Google. Tente novamente.'}
    </p>
  );
}

async function AppName() {
  return getAppName();
}

async function RedirectIfSignedIn() {
  if (await getSession()) redirect('/dashboard');
  return null;
}

export default function Home({ searchParams }: PageProps<'/'>) {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            <Suspense>
              <AppName />
            </Suspense>
          </CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha ou com sua conta Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <EmailSignInForm />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleSignInButton />
          <Suspense>
            <SignInError searchParams={searchParams} />
            <RedirectIfSignedIn />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
