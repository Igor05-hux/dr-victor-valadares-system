"use client";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";
import Link from "next/link";

import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

const statusStyles: Record<
  AppointmentStatus,
  string
> = {
  Confirmada:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Pendente:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Cancelada:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  Concluída:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export function UpcomingAppointments({
  appointments,
  isLoading = false,
}: UpcomingAppointmentsProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">
            Próximos atendimentos
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Consultas futuras aguardando atendimento.
          </p>
        </div>

        <Link
          href="/agenda"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Ver agenda
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-muted"
              />
            ),
          )}
        </div>
      ) : appointments.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum atendimento futuro encontrado.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href="/agenda"
              className="flex flex-col gap-3 rounded-xl border p-4 transition hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {appointment.patient}
                </p>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {appointment.procedure}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays size={14} />
                  {formatDate(appointment.date)}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 size={14} />
                  {appointment.time}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                >
                  {appointment.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}