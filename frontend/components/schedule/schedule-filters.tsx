"use client";

import { Filter, Search, X } from "lucide-react";

import type { AppointmentStatus } from "@/types/appointment";

interface ScheduleFiltersProps {
  searchTerm: string;
  professionalFilter: string;
  statusFilter: "Todos" | AppointmentStatus;
  professionals: string[];
  onSearchChange: (value: string) => void;
  onProfessionalChange: (value: string) => void;
  onStatusChange: (
    value: "Todos" | AppointmentStatus,
  ) => void;
  onClearFilters: () => void;
}

const statuses: Array<
  "Todos" | AppointmentStatus
> = [
  "Todos",
  "Pendente",
  "Confirmada",
  "Concluída",
  "Cancelada",
];

export function ScheduleFilters({
  searchTerm,
  professionalFilter,
  statusFilter,
  professionals,
  onSearchChange,
  onProfessionalChange,
  onStatusChange,
  onClearFilters,
}: ScheduleFiltersProps) {
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    professionalFilter !== "Todos" ||
    statusFilter !== "Todos";

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">Filtros</h2>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <X size={14} />
            Limpar
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2 rounded-xl border px-3 focus-within:border-blue-600">
          <Search
            size={18}
            className="text-muted-foreground"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar paciente ou procedimento..."
            className="h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="relative">
          <Filter
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <select
            value={professionalFilter}
            onChange={(event) =>
              onProfessionalChange(event.target.value)
            }
            className="h-12 w-full appearance-none rounded-xl border bg-background px-4 pr-10 text-sm outline-none transition hover:bg-muted focus:border-blue-600"
          >
            <option value="Todos">
              Todos os profissionais
            </option>

            {professionals.map((professional) => (
              <option
                key={professional}
                value={professional}
              >
                {professional}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | "Todos"
                  | AppointmentStatus,
              )
            }
            className="h-12 w-full appearance-none rounded-xl border bg-background px-4 pr-10 text-sm outline-none transition hover:bg-muted focus:border-blue-600"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "Todos"
                  ? "Todos os status"
                  : status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
}