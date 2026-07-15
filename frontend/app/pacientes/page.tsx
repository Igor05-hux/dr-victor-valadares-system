"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientFilters } from "@/components/patients/patient-filters";
import { getPatients } from "@/services/patient.service";
import type { Patient } from "@/types/patient";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        <PatientFilters />

        <div className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Users size={22} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pacientes cadastrados
            </p>
            <strong className="text-2xl">
              {isLoading ? "..." : patients.length}
            </strong>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Carregando pacientes...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard
              key={patient.id}
              patient={patient}
              onDeleted={handlePatientDeleted}
               />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}