import { CalendarDays, Mail, Phone } from "lucide-react";

import type { Patient } from "@/types/patient";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold">{patient.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Nascimento: {patient.birthDate}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            patient.status === "Ativo"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {patient.status}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Mail size={16} />
          {patient.email}
        </p>

        <p className="flex items-center gap-2 text-muted-foreground">
          <Phone size={16} />
          {patient.phone}
        </p>

        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays size={16} />
          Última consulta: {patient.lastAppointment}
        </p>
      </div>
    </article>
  );
}