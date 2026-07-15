"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  PatientForm,
  type PatientFormData,
} from "@/components/patients/patient-form";
import {
  getPatientById,
  updatePatient,
} from "@/services/patient.service";
import type { Patient } from "@/types/patient";

export default function EditPatientPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await getPatientById(params.id);

        if (!data) {
          toast.error("Paciente não encontrado.");
          router.push("/pacientes");
          return;
        }

        setPatient(data);
      } catch {
        toast.error("Não foi possível carregar o paciente.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadPatient();
  }, [params.id, router]);

  async function handleUpdatePatient(data: PatientFormData) {
    try {
      await updatePatient(params.id, data);

      toast.success("Paciente atualizado com sucesso.");
      router.push("/pacientes");
    } catch {
      toast.error("Não foi possível atualizar o paciente.");
    }
  }

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Editar paciente</h1>
            <p className="text-sm text-muted-foreground">
              Atualize os dados pessoais e de contato do paciente.
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

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Carregando paciente...
          </div>
        ) : patient ? (
          <PatientForm
            defaultValues={{
              name: patient.name,
              email: patient.email,
              phone: patient.phone,
              birthDate: patient.birthDate,
              cpf: patient.cpf ?? "",
              address: patient.address ?? "",
              notes: patient.notes ?? "",
            }}
            submitLabel="Salvar alterações"
            onSubmit={handleUpdatePatient}
          />
        ) : null}
      </section>
    </DashboardLayout>
  );
}