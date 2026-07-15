import { Filter, Search } from "lucide-react";

export function ScheduleFilters() {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="font-bold">Filtros</h2>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2 rounded-xl border px-3">
          <Search size={18} className="text-muted-foreground" />

          <input
            type="text"
            placeholder="Buscar paciente..."
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition hover:bg-muted">
          Todos os profissionais
          <Filter size={17} />
        </button>

        <button className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition hover:bg-muted">
          Todos os status
          <Filter size={17} />
        </button>
      </div>
    </article>
  );
}