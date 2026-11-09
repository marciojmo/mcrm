import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-8xl font-bold tracking-tight text-muted-foreground/40">
        404
      </p>
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-xl font-semibold">
          Esta página foi movida para a coluna “Nunca existiu”.
        </h1>
        <p className="text-sm text-muted-foreground">
          Procuramos em todos os quadros, abrimos todos os cartões e até
          perguntamos para o estagiário. Nada. Se servir de consolo, ela também
          não tinha prazo.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Voltar para um lugar que existe
      </Link>
    </main>
  );
}
