import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { GoogleSignInButton } from '@/components/features/auth/GoogleSignInButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { env } from '@/config/env';
import { getSession } from '@/services/sessionService';

async function SignInError({
  searchParams,
}: {
  searchParams: PageProps<'/'>['searchParams'];
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      Não foi possível entrar. Use uma conta @{env.GOOGLE_WORKSPACE_DOMAIN}.
    </p>
  );
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
          <CardTitle className="text-xl">MCRM</CardTitle>
          <CardDescription>
            Entre ou crie sua conta com o Google Workspace da instituição (@
            {env.GOOGLE_WORKSPACE_DOMAIN}).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
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
