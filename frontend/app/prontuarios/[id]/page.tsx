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
import {
  MedicalRecordTabs,
  type MedicalRecordTab,
} from "@/components/medical-record/medical-record-tabs";
import { PatientSummary } from "@/components/medical-record/patient-summary";
import { PrescriptionForm } from "@/components/medical-record/prescription-form";
import { Prescriptions } from "@/components/medical-record/prescriptions";
import { QuickActions } from "@/components/medical-record/quick-actions";
import {
  addPrescription,
  getMedicalRecordByPatientId,
} from "@/services/medical-record.service";
import { getPatientById } from "@/services/patient.service";
import type {
  ClinicalEvolution as ClinicalEvolutionType,
  MedicalHistoryItem,
  MedicalRecord,
  PrescriptionItem,
} from "@/types/medical-record";
import type { Patient } from "@/types/patient";

export default function MedicalRecordPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);

  const [medicalRecord, setMedicalRecord] =
    useState<MedicalRecord | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState<MedicalRecordTab>("summary");

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
        [category]: [
          ...currentRecord[category],
          item,
        ],
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

  async function handlePrescriptionCreated(
    items: PrescriptionItem[],
    observations: string,
  ) {
    if (!patient) {
      return;
    }

    try {
      const prescription = await addPrescription(
        patient.id,
        {
          date: new Date().toISOString().slice(0, 10),
          professional: "Dr. Victor Valadares",
          items,
          observations: observations.trim() || undefined,
        },
      );

      setMedicalRecord((currentRecord) => {
        if (!currentRecord) {
          return currentRecord;
        }

        return {
          ...currentRecord,
          prescriptions: [
            prescription,
            ...currentRecord.prescriptions,
          ],
        };
      });

      toast.success("Receita salva com sucesso.");
    } catch {
      toast.error("Não foi possível salvar a receita.");
    }
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

            <MedicalRecordTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {activeTab === "summary" && (
              <MedicalHistory
                patientId={patient.id}
                allergies={medicalRecord.allergies}
                conditions={medicalRecord.conditions}
                medications={medicalRecord.medications}
                onItemCreated={handleHistoryItemCreated}
              />
            )}

            {activeTab === "evolutions" && (
              <ClinicalEvolution
                patientId={patient.id}
                evolutions={medicalRecord.evolutions}
                onCreated={handleEvolutionCreated}
              />
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-6">
                <PrescriptionForm
                  onSave={handlePrescriptionCreated}
                />

                <Prescriptions
                  prescriptions={medicalRecord.prescriptions}
                />
              </div>
            )}

            {activeTab === "consultations" && (
              <div className="grid gap-6 xl:grid-cols-[1.6fr_0.7fr]">
                <ConsultationTimeline
                  consultations={medicalRecord.consultations}
                />

                <QuickActions />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            Não foi possível exibir o prontuário.
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}