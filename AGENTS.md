<!-- mstack:start -->

# Regras do projeto

## Princípios

1. **Menor entrega que resolve o problema.** Faça só o que foi pedido. Nada de abstração "para o futuro".
2. **Menos código.** Antes de adicionar, procure o que remover ou reutilizar.
3. **Sem comentários.** O código se explica por nomes e estrutura. Única exceção: diretivas de ferramenta (`eslint-disable`, `@ts-expect-error`) com o motivo.
4. **Prove que funciona.** Antes de dizer "pronto", rode as verificações do projeto e execute o comportamento real. Relate o que rodou e o resultado. "Compila" não é prova.
5. **Corrija a causa raiz**, não o sintoma.

## Stack

Next.js (App Router), TypeScript strict, Prisma e Postgres. Siga as convenções oficiais do Next.js.

- Server Components por padrão. `'use client'` só para interatividade, APIs do browser ou hooks.
- Mutações via Server Actions em `actions.ts` ao lado da rota. Elas chamam `services/`.
- Rotas que buscam dados têm `loading.tsx` e `error.tsx`.
- `next/image` para imagens. `next/dynamic` para componentes pesados.
- Variáveis de ambiente lidas e validadas só em `src/config/env.ts`. Só `NEXT_PUBLIC_*` chega ao browser.

## Estrutura

```
prisma/schema.prisma
src/
├── app/            rotas, layouts, actions.ts
├── components/
│   ├── ui/         componentes reutilizáveis sem regra de negócio
│   ├── features/   componentes de uma feature
│   └── layouts/
├── services/       todo acesso ao banco (Prisma) e APIs externas
├── lib/            utilitários e prisma.ts (singleton do client)
├── hooks/
├── types/
├── constants/
└── config/
```

Cada pasta tem uma responsabilidade. Nada de Prisma fora de `services/`.

## Nomenclatura

Código, nomes e commits em inglês.

| Item                        | Padrão                                              | Exemplo                           |
| --------------------------- | --------------------------------------------------- | --------------------------------- |
| Componente (arquivo e nome) | PascalCase                                          | `UserProfile.tsx`                 |
| Hook                        | camelCase com `use`                                 | `useAuth.ts`                      |
| Utilitário, service         | camelCase                                           | `formatDate.ts`, `userService.ts` |
| Função                      | camelCase, começa com verbo                         | `getUserById`                     |
| Booleano                    | `is`/`has`/`can`                                    | `isActive`                        |
| Constante global            | UPPER_SNAKE_CASE                                    | `MAX_RETRY_COUNT`                 |
| Tipo, interface             | PascalCase, sem prefixo `I`                         | `User`, `ApiResponse`             |
| Pasta                       | kebab-case (em `app/`, segue o roteamento do Next)  | `user-settings/`                  |
| Model Prisma                | PascalCase singular, `@@map` para snake_case plural | `User` → `users`                  |
| Campo Prisma                | camelCase, `@map` para snake_case                   | `createdAt` → `created_at`        |

## Componentes

- Uma responsabilidade. No máximo 200 linhas (o lint bloqueia).
- Props tipadas com `interface`. Valores padrão na desestruturação.
- Uniões para valores restritos (`type Role = 'admin' | 'user'`). Sem `any`.

## Verificação

- `npm run check` roda lint, typecheck e formatação. Precisa passar antes de qualquer entrega.
- Mudou o `schema.prisma`? Rode `npx prisma migrate dev --name <descricao>`.

<!-- mstack:end -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
