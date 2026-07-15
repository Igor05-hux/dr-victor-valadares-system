import { Filter, Search } from "lucide-react";

export function PatientFilters() {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-3">
        <Search size={18} className="text-muted-foreground" />

        <input
          type="text"
          placeholder="Buscar paciente por nome, telefone ou e-mail..."
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition hover:bg-muted"
      >
        <Filter size={17} />
        Todos os status
      </button>
    </div>
  );
}