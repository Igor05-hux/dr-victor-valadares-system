"use client";

import {
  ArrowRight,
  Clock3,
  History,
  Stethoscope,
} from "lucide-react";

import {
  toothStatusOptions,
  type ToothHistoryEntry,
  type ToothStatus,
} from "@/types/odontogram";

interface ToothHistoryProps {
  history: ToothHistoryEntry[];
}

function getStatusLabel(status: ToothStatus) {
  return (
    toothStatusOptions.find(
      (option) => option.value === status,
    )?.label ?? status
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ToothHistory({
  history,
}: ToothHistoryProps) {
  if (history.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <History
            size={22}
            className="text-muted-foreground"
          />
        </div>

        <h3 className="mt-4 font-semibold">
          Nenhuma alteração registrada
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          As alterações realizadas nos dentes aparecerão
          neste histórico.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <History size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              Histórico do odontograma
            </h2>

            <p className="text-sm text-muted-foreground">
              {history.length}{" "}
              {history.length === 1
                ? "alteração registrada"
                : "alterações registradas"}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {history.map((entry) => (
          <article
            key={entry.id}
            className="p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-muted px-3 py-1 text-sm font-semibold">
                    Dente {entry.toothNumber}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {entry.toothName}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border px-3 py-1.5 text-sm">
                    {getStatusLabel(
                      entry.previousStatus,
                    )}
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-muted-foreground"
                  />

                  <span className="rounded-lg border px-3 py-1.5 text-sm font-semibold">
                    {getStatusLabel(entry.newStatus)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock3 size={15} />
                  <span>
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Stethoscope size={15} />
                  <span>{entry.professional}</span>
                </div>
              </div>
            </div>

            {(entry.previousNotes ||
              entry.newNotes) && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Observação anterior
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {entry.previousNotes ||
                      "Nenhuma observação registrada."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nova observação
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {entry.newNotes ||
                      "Nenhuma observação registrada."}
                  </p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}