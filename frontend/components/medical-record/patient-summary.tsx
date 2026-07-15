import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";

import type { Patient } from "@/types/patient";

interface PatientSummaryProps {
  patient: Patient;
}

export function PatientSummary({
  patient,
}: PatientSummaryProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <UserRound size={26} />
          </div>

          <div>
            <h2 className="text-xl font-bold">{patient.name}</h2>

            <p className="text-sm text-muted-foreground">
              Paciente {patient.status.toLowerCase()}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            patient.status === "Ativo"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {patient.status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
          <Mail size={18} className="text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="text-sm font-medium">{patient.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
          <Phone size={18} className="text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">Telefone</p>
            <p className="text-sm font-medium">{patient.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
          <CalendarDays size={18} className="text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">Nascimento</p>
            <p className="text-sm font-medium">{patient.birthDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
          <CalendarDays size={18} className="text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">
              Última consulta
            </p>

            <p className="text-sm font-medium">
              {patient.lastAppointment}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}