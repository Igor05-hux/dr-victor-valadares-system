"use client";

import {
  CalendarPlus,
  FilePlus2,
  UserPlus,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Novo paciente",
    description: "Cadastrar paciente",
    href: "/pacientes/novo",
    icon: UserPlus,
  },
  {
    label: "Nova consulta",
    description: "Abrir agenda",
    href: "/agenda",
    icon: CalendarPlus,
  },
  {
    label: "Gerar documento",
    description: "Atestado, termo ou contrato",
    href: "/documentos/gerar",
    icon: FilePlus2,
  },
  {
    label: "Novo lançamento",
    description: "Abrir financeiro",
    href: "/financeiro",
    icon: WalletCards,
  },
] as const;

export function DashboardQuickActions() {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold">
          Ações rápidas
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Acesse as tarefas mais usadas do consultório.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:bg-muted/40 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Icon size={18} />
              </div>

              <div>
                <p className="font-semibold">
                  {action.label}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </article>
  );
}