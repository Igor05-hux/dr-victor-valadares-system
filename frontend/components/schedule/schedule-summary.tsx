import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Clock3,
} from "lucide-react";

import type { Appointment } from "@/types/appointment";

interface ScheduleSummaryProps {
  appointments: Appointment[];
}

export function ScheduleSummary({
  appointments,
}: ScheduleSummaryProps) {
  const confirmedCount = appointments.filter(
    (appointment) =>
      appointment.status === "Confirmada",
  ).length;

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "Pendente",
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "Concluída",
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) =>
      appointment.status === "Cancelada",
  ).length;

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <CalendarDays size={22} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Consultas do dia
          </p>

          <strong className="text-2xl">
            {appointments.length}
          </strong>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/40">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 size={16} />

            <p className="text-xs font-medium">
              Confirmadas
            </p>
          </div>

          <strong className="mt-2 block text-xl">
            {confirmedCount}
          </strong>
        </div>

        <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <CircleAlert size={16} />

            <p className="text-xs font-medium">
              Pendentes
            </p>
          </div>

          <strong className="mt-2 block text-xl">
            {pendingCount}
          </strong>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/40">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Clock3 size={16} />

            <p className="text-xs font-medium">
              Concluídas
            </p>
          </div>

          <strong className="mt-2 block text-xl">
            {completedCount}
          </strong>
        </div>

        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/40">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <CircleX size={16} />

            <p className="text-xs font-medium">
              Canceladas
            </p>
          </div>

          <strong className="mt-2 block text-xl">
            {cancelledCount}
          </strong>
        </div>
      </div>
    </article>
  );
}