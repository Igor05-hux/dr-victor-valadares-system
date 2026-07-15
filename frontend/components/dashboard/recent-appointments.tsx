interface Appointment {
  time: string;
  patient: string;
  procedure: string;
  status: "Confirmada" | "Pendente";
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export function RecentAppointments({
  appointments,
}: RecentAppointmentsProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Agenda de hoje</h3>
          <p className="text-sm text-muted-foreground">
            Próximos atendimentos do consultório
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Nova consulta
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b text-xs uppercase text-muted-foreground">
              <th className="pb-3 font-semibold">Horário</th>
              <th className="pb-3 font-semibold">Paciente</th>
              <th className="pb-3 font-semibold">Procedimento</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={`${appointment.time}-${appointment.patient}`}
                className="border-b last:border-0"
              >
                <td className="py-4 font-semibold">{appointment.time}</td>
                <td className="py-4">{appointment.patient}</td>
                <td className="py-4 text-muted-foreground">
                  {appointment.procedure}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status === "Confirmada"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}