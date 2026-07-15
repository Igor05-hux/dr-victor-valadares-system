import { CalendarDays, Stethoscope } from "lucide-react";

import type { ConsultationRecord } from "@/types/medical-record";

interface ConsultationTimelineProps {
  consultations: ConsultationRecord[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function ConsultationTimeline({
  consultations,
}: ConsultationTimelineProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Stethoscope size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Histórico de consultas
          </h2>

          <p className="text-sm text-muted-foreground">
            Acompanhe a evolução clínica do paciente.
          </p>
        </div>
      </div>

      {consultations.length === 0 ? (
        <div className="mt-6 rounded-xl bg-muted p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma consulta registrada.
          </p>
        </div>
      ) : (
        <div className="relative mt-6 space-y-6 border-l pl-6">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="relative"
            >
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-blue-600" />

              <div className="rounded-2xl border p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold">
                      {consultation.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {consultation.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays size={16} />
                    {formatDate(consultation.date)}
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  Profissional: {consultation.professional}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}