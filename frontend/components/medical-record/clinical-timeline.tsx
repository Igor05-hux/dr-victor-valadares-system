"use client";

import {
  CalendarDays,
  ClipboardPenLine,
  Clock3,
  FileText,
  Pill,
  Smile,
  Stethoscope,
} from "lucide-react";

import {
  toothStatusOptions,
  type ToothStatus,
} from "@/types/odontogram";
import type {
  TimelineEvent,
  TimelineEventType,
} from "@/types/timeline";

interface ClinicalTimelineProps {
  events: TimelineEvent[];
}

interface TimelineStyle {
  icon: React.ElementType;
  label: string;
  iconClassName: string;
  containerClassName: string;
}

const timelineStyles: Record<
  TimelineEventType,
  TimelineStyle
> = {
  consultation: {
    icon: CalendarDays,
    label: "Consulta",
    iconClassName: "text-violet-700",
    containerClassName:
      "border-violet-200 bg-violet-50",
  },
  evolution: {
    icon: ClipboardPenLine,
    label: "Evolução clínica",
    iconClassName: "text-emerald-700",
    containerClassName:
      "border-emerald-200 bg-emerald-50",
  },
  prescription: {
    icon: Pill,
    label: "Receita",
    iconClassName: "text-amber-700",
    containerClassName:
      "border-amber-200 bg-amber-50",
  },
  odontogram: {
  icon: Smile,
  label: "Odontograma",
  iconClassName: "text-blue-700",
  containerClassName:
    "border-blue-200 bg-blue-50",
},
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(parsedDate);
}

function formatTime(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function getStatusLabel(status: string) {
  return (
    toothStatusOptions.find(
      (option) =>
        option.value ===
        (status as ToothStatus),
    )?.label ?? status
  );
}

function getEventDetails(event: TimelineEvent) {
  if (event.type === "prescription") {
    return event.medications.length > 0
      ? event.medications.join(", ")
      : "Nenhum medicamento informado.";
  }

  if (event.type === "odontogram") {
    return `${getStatusLabel(
      event.previousStatus,
    )} → ${getStatusLabel(event.newStatus)}`;
  }

  if (event.type === "consultation") {
    return event.procedure;
  }

  return undefined;
}

export function ClinicalTimeline({
  events,
}: ClinicalTimelineProps) {
  if (events.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText
            size={22}
            className="text-muted-foreground"
          />
        </div>

        <h2 className="mt-4 font-semibold">
          Nenhum evento clínico registrado
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Consultas, evoluções, receitas e alterações do
          odontograma aparecerão aqui.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">
          Timeline clínica
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Histórico completo do paciente em ordem cronológica.
        </p>
      </div>

      <div className="p-5">
        <div className="relative space-y-6 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-border">
          {events.map((event) => {
            const style = timelineStyles[event.type];
            const Icon = style.icon;
            const details = getEventDetails(event);
            const time = formatTime(event.createdAt);

            return (
              <article
                key={event.id}
                className="relative pl-14"
              >
                <div
                  className={[
                    "absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border",
                    style.containerClassName,
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    className={style.iconClassName}
                  />
                </div>

                <div className="rounded-2xl border bg-background p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {style.label}
                      </span>

                      <h3 className="mt-1 text-base font-semibold">
                        {event.title}
                      </h3>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />

                        <span>
                          {formatDate(event.createdAt)}
                        </span>
                      </div>

                      {time && (
                        <div className="mt-1 flex items-center gap-2">
                          <Clock3 size={15} />
                          <span>{time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {details && (
                    <div className="mt-4 rounded-xl bg-muted/40 p-3 text-sm">
                      {details}
                    </div>
                  )}

                  {event.description && (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>
                  )}

                  {event.professional && (
                    <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                      <Stethoscope size={15} />

                      <span>{event.professional}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}