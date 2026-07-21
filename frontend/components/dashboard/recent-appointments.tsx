"use client";

import Link from "next/link";

import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

interface RecentAppointmentsProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

const statusStyles: Record<AppointmentStatus, string> = {
  Confirmada:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Pendente:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Cancelada:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  Concluída:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function RecentAppointments({
  appointments,
  isLoading = false,
}: RecentAppointmentsProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">
            Agenda de hoje
          </h3>

          <p className="text-sm text-muted-foreground">
            Atendimentos agendados para o dia
          </p>
        </div>

        <Link
          href="/agenda"
          className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ver agenda
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Carregando consultas...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-semibold">
            Nenhuma consulta agendada para hoje
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Acesse a agenda para cadastrar um novo
            atendimento.
          </p>

          <Link
            href="/agenda"
            className="mt-4 inline-flex rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            Abrir agenda
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="pb-3 font-semibold">
                  Horário
                </th>
                <th className="pb-3 font-semibold">
                  Paciente
                </th>
                <th className="pb-3 font-semibold">
                  Procedimento
                </th>
                <th className="pb-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b last:border-0"
                >
                  <td className="py-4 font-semibold">
                    {appointment.time}
                  </td>

                  <td className="py-4">
                    {appointment.patient}
                  </td>

                  <td className="py-4 text-muted-foreground">
                    {appointment.procedure}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}