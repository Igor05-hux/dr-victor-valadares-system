"use client";

import { Filter, Search } from "lucide-react";

import type { PatientStatus } from "@/types/patient";

interface PatientFiltersProps {
  searchTerm: string;
  status: "Todos" | PatientStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "Todos" | PatientStatus) => void;
}

export function PatientFilters({
  searchTerm,
  status,
  onSearchChange,
  onStatusChange,
}: PatientFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex flex-1 items-center gap-2 rounded-xl border bg-card px-3">
        <Search size={18} className="text-muted-foreground" />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar paciente por nome, telefone ou e-mail..."
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-2 rounded-xl border bg-card px-3">
        <Filter size={17} className="text-muted-foreground" />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as "Todos" | PatientStatus,
            )
          }
          className="h-11 min-w-40 bg-transparent text-sm outline-none"
        >
          <option value="Todos">Todos os status</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
        </select>
      </div>
    </div>
  );
}