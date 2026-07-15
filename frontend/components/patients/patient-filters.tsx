"use client";

import { Filter, Search } from "lucide-react";

import type { PatientStatus } from "@/types/patient";

interface PatientFiltersProps {
  searchTerm: string;
  status: "Todos" | PatientStatus;

  sortBy: "recent" | "az" | "za";

  onSearchChange: (value: string) => void;
  onStatusChange: (value: "Todos" | PatientStatus) => void;

  onSortChange: (value: "recent" | "az" | "za") => void;
}

export function PatientFilters({
  searchTerm,
  status,
  onSearchChange,
  onStatusChange,
  sortBy,
onSortChange,
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
    value={sortBy}
    onChange={(event) =>
      onSortChange(
        event.target.value as "recent" | "az" | "za",
      )
    }
    className="h-11 min-w-40 bg-transparent text-sm outline-none"
  >
    <option value="recent">Mais recentes</option>
    <option value="az">Nome A-Z</option>
    <option value="za">Nome Z-A</option>
  </select>
</div>
    </div>
  );
}