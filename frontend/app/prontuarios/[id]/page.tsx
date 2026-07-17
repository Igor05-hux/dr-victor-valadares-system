"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClinicalEvolution } from "@/components/medical-record/clinical-evolution";
import { ConsultationTimeline } from "@/components/medical-record/consultation-timeline";
import { MedicalHistory } from "@/components/medical-record/medical-history";
import { PatientSummary } from "@/components/medical-record/patient-summary";
import { QuickActions } from "@/components/medical-record/quick-actions";
import { getMedicalRecordByPatientId } from "@/services/medical-record.service";
import { getPatientById } from "@/services/patient.service";
import type {
  ClinicalEvolution as ClinicalEvolutionType,
  MedicalHistoryItem,
  MedicalRecord,
} from "@/types/medical-record";
import type { Patient } from "@/types/patient";
import { Prescriptions } from "@/components/medical-record/prescriptions";

export default function MedicalRecordPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecord, setMedicalRecord] =
    useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMedicalRecord() {
      try {
        const [patientData, recordData] = await Promise.all([
          getPatientById(params.id),
          getMedicalRecordByPatientId(params.id),
        ]);

        if (!patientData) {
          toast.error("Paciente não encontrado.");
          router.push("/pacientes");
          return;
        }

        setPatient(patientData);
        setMedicalRecord(recordData);
      } catch {
        toast.error("Não foi possível carregar o prontuário.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadMedicalRecord();
  }, [params.id, router]);

  function handleHistoryItemCreated(
    category: "allergies" | "conditions" | "medications",
    item: MedicalHistoryItem,
  ) {
    setMedicalRecord((currentRecord) => {
      if (!currentRecord) {
        return currentRecord;
      }

      return {
        ...currentRecord,
        [category]: [...currentRecord[category], item],
      };
    });
  }

  function handleEvolutionCreated(
    evolution: ClinicalEvolutionType,
  ) {
    setMedicalRecord((currentRecord) => {
      if (!currentRecord) {
        return currentRecord;
      }

      return {
        ...currentRecord,
        evolutions: [
          evolution,
          ...currentRecord.evolutions,
        ],
      };
    });
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Prontuário do paciente
            </h1>

            <p className="text-sm text-muted-foreground">
              Consulte informações clínicas, histórico e documentos.
            </p>
          </div>

          <Link
            href="/pacientes"
            className="flex items-center justify-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft size={18} />
            Voltar para pacientes
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            Carregando prontuário...
          </div>
        ) : patient && medicalRecord ? (
          <>
            <PatientSummary patient={patient} />

            <MedicalHistory
              patientId={patient.id}
              allergies={medicalRecord.allergies}
              conditions={medicalRecord.conditions}
              medications={medicalRecord.medications}
              onItemCreated={handleHistoryItemCreated}
            />

            <ClinicalEvolution
              patientId={patient.id}
              evolutions={medicalRecord.evolutions}
              onCreated={handleEvolutionCreated}
            />

            <Prescriptions
               prescriptions={medicalRecord.prescriptions}
               />

            <div className="grid gap-6 xl:grid-cols-[1.6fr_0.7fr]">
              <ConsultationTimeline
                consultations={medicalRecord.consultations}
              />

              <QuickActions />
            </div>
          </>
        ) : null}
      </section>
    </DashboardLayout>
  );
}