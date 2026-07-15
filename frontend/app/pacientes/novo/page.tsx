"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  PatientForm,
  type PatientFormData,
} from "@/components/patients/patient-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createPatient } from "@/services/patient.service";

export default function NewPatientPage() {
  const router = useRouter();

  async function handleCreatePatient(data: PatientFormData) {
    try {
      await createPatient(data);

      toast.success("Paciente cadastrado com sucesso.");
      router.push("/pacientes");
    } catch {
      toast.error("Não foi possível cadastrar o paciente.");
    }
  }

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Novo paciente</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre os dados pessoais e de contato do paciente.
            </p>
          </div>

          <Link
            href="/pacientes"
            className="flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </div>

        <PatientForm onSubmit={handleCreatePatient} />
      </section>
    </DashboardLayout>
  );
}