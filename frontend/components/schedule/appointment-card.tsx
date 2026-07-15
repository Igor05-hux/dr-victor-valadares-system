import { Clock3, UserRound } from "lucide-react";
import type { AppointmentStatus} from "@/types/appointment";

interface AppointmentCardProps {
  time: string;
  patient: string;
  procedure: string;
  professional: string;
  status: AppointmentStatus;
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

export function AppointmentCard({
  time,
  patient,
  procedure,
  professional,
  status,
}: AppointmentCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Clock3 size={21} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <strong>{time}</strong>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold">{patient}</span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {procedure}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <UserRound size={14} />
            {professional}
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
      >
        {status}
      </span>
    </article>
  );
}