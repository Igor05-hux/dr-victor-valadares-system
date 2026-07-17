"use client";

import {
  CalendarDays,
  FileText,
  Pill,
} from "lucide-react";

import type { Prescription } from "@/types/medical-record";

interface PrescriptionsProps {
  prescriptions: Prescription[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function Prescriptions({
  prescriptions,
}: PrescriptionsProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <FileText size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Receitas
          </h2>

          <p className="text-sm text-muted-foreground">
            Histórico de prescrições emitidas.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {prescriptions.length === 0 ? (
          <div className="rounded-xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma receita cadastrada.
            </p>
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="rounded-2xl border p-5"
            >
              <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold">
                    {prescription.professional}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Receita médica
                  </p>
                </div>

                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  {formatDate(prescription.date)}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {prescription.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-muted p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Pill size={18} />

                      <strong>
                        {item.medication}
                      </strong>
                    </div>

                    <div className="mt-2 text-sm space-y-1">
                      <p>
                        <strong>Dosagem:</strong>{" "}
                        {item.dosage}
                      </p>

                      <p>
                        <strong>Modo de uso:</strong>{" "}
                        {item.instructions}
                      </p>

                      {item.duration && (
                        <p>
                          <strong>Duração:</strong>{" "}
                          {item.duration}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {prescription.observations && (
                  <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Observações
                    </p>

                    <p className="mt-2 text-sm">
                      {prescription.observations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}