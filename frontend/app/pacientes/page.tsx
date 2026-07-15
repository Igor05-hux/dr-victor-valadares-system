import { Plus, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientFilters } from "@/components/patients/patient-filters";
import { getPatients } from "@/services/patient.service";

export default async function PatientsPage() {
  const patients = await getPatients();

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

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo paciente
          </button>
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

            <strong className="text-2xl">{patients.length}</strong>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}