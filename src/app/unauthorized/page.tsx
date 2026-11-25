import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

export default function Unauthorized() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-8xl font-bold tracking-tight text-muted-foreground/40">
        403
      </p>
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-xl font-semibold">Não autorizado</h1>
        <p className="text-sm text-muted-foreground">
          Esta conta Google não tem acesso ao sistema. Peça a um administrador
          para criar seu usuário com este e-mail.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Voltar para o login
      </Link>
    </main>
  );
}
