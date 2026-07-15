import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppointmentCard } from "@/components/schedule/appointment-card";
import { ScheduleFilters } from "@/components/schedule/schedule-filters";
import { ScheduleSummary } from "@/components/schedule/schedule-summary";
import { getAppointments } from "@/services/schedule.service";

const weekDays = [
  { day: "SEG", date: "13" },
  { day: "TER", date: "14", active: true },
  { day: "QUA", date: "15" },
  { day: "QUI", date: "16" },
  { day: "SEX", date: "17" },
  { day: "SÁB", date: "18" },
];

export default async function AgendaPage() {
  const appointments = await getAppointments();

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agenda</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie consultas, horários e confirmações.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus size={18} />
            Nova consulta
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
                  aria-label="Semana anterior"
                >
                  <ChevronLeft size={18} />
                </button>

                <div>
                  <h2 className="font-bold">Julho de 2026</h2>
                  <p className="text-sm text-muted-foreground">
                    Semana de 13 a 18 de julho
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
                  aria-label="Próxima semana"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted">
                  Hoje
                </button>

                <button className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Semana
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {weekDays.map((item) => (
                <button
                  key={`${item.day}-${item.date}`}
                  type="button"
                  className={`rounded-2xl border p-3 text-center transition ${
                    item.active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="block text-xs font-semibold opacity-75">
                    {item.day}
                  </span>
                  <strong className="mt-1 block text-xl">{item.date}</strong>
                </button>
              ))}
            </div>

           <div className="mt-6 space-y-3">
  {appointments.map((appointment) => (
  <AppointmentCard
    key={appointment.id}
    time={appointment.time}
    patient={appointment.patient}
    procedure={appointment.procedure}
    professional={appointment.professional}
    status={appointment.status}
  />
))}
</div>
          </article>

          <aside className="space-y-6">
            <ScheduleFilters />

            <ScheduleSummary />
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}