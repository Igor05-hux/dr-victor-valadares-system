import { CalendarDays } from "lucide-react";

export function ScheduleSummary() {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <CalendarDays size={22} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Consultas agendadas
          </p>

          <strong className="text-2xl">
            12
          </strong>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Confirmadas
          </p>

          <strong className="mt-1 block text-xl">
            9
          </strong>
        </div>

        <div className="rounded-xl bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Pendentes
          </p>

          <strong className="mt-1 block text-xl">
            3
          </strong>
        </div>
      </div>
    </article>
  );
}