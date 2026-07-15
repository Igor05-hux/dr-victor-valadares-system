"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientFilters } from "@/components/patients/patient-filters";
import { getPatients } from "@/services/patient.service";
import type { Patient } from "@/types/patient";

const ITEMS_PER_PAGE = 10;

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Todos" | Patient["status"]
  >("Todos");
  const [sortBy, setSortBy] = useState<"recent" | "az" | "za">(
    "recent",
  );

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPatients();
  }, []);

  function handlePatientDeleted(patientId: string) {
    setPatients((currentPatients) =>
      currentPatients.filter(
        (patient) => patient.id !== patientId,
      ),
    );
  }

  const normalizedSearch = searchTerm
    .trim()
    .toLocaleLowerCase("pt-BR");

  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        patient.name
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        patient.email
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        patient.phone.includes(searchTerm.trim());

      const matchesStatus =
        statusFilter === "Todos" ||
        patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.name.localeCompare(b.name, "pt-BR");

        case "za":
          return b.name.localeCompare(a.name, "pt-BR");

        default:
          return b.id.localeCompare(a.id);
      }
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / ITEMS_PER_PAGE),
  );

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pacientes</h1>

            <p className="text-sm text-muted-foreground">
              Consulte, cadastre e acompanhe os pacientes do consultório.
            </p>
          </div>

          <Link
            href="/pacientes/novo"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo paciente
          </Link>
        </div>

        <PatientFilters
          searchTerm={searchTerm}
          status={statusFilter}
          sortBy={sortBy}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          onSortChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
        />

        <div className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Users size={22} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pacientes encontrados
            </p>

            <strong className="text-2xl">
              {isLoading ? "..." : filteredPatients.length}
            </strong>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Carregando pacientes...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <Users
              size={42}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-lg font-bold">
              Nenhum paciente encontrado
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Ajuste a busca ou o filtro para visualizar outros pacientes.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDeleted={handlePatientDeleted}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1),
                  )
                }
                className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="px-4 text-sm">
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages),
                  )
                }
                className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}