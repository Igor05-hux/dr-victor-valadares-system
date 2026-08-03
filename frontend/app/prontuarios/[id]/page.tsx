"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useMedicalRecord } from "@/hooks/use-medical-record";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClinicalEvolution } from "@/components/medical-record/clinical-evolution";
import { ConsultationTimeline } from "@/components/medical-record/consultation-timeline";
import { MedicalHistory } from "@/components/medical-record/medical-history";
import { MedicalRecordStats } from "@/components/medical-record/medical-record-stats";
import {
  MedicalRecordTabs,
  type MedicalRecordTab,
} from "@/components/medical-record/medical-record-tabs";
import { PatientSummary } from "@/components/medical-record/patient-summary";
import { PrescriptionForm } from "@/components/medical-record/prescription-form";
import { Prescriptions } from "@/components/medical-record/prescriptions";
import { QuickActions } from "@/components/medical-record/quick-actions";
import { Odontogram } from "@/components/odontogram/odontogram";
import { ClinicalTimeline } from "@/components/medical-record/clinical-timeline";
import { buildTimelineEvents } from "@/services/timeline.service";
import { MedicalDocumentForm } from "@/components/medical-record/medical-document-form";
import { MedicalDocuments } from "@/components/medical-record/medical-documents";
import { GeneratedDocuments } from "@/components/medical-record/generated-documents";

export default function MedicalRecordPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<MedicalRecordTab>("summary");

  const handlePatientNotFound = useCallback(() => {
    router.push("/pacientes");
  }, [router]);

const {
  patient,
  medicalRecord,
  teeth,
  toothHistory,
  documents,
  generatedDocuments,
  isLoading,
  handleHistoryItemCreated,
  handleEvolutionCreated,
  handlePrescriptionCreated,
  handleToothUpdate,
  handleDocumentCreated,
  handleDocumentDeleted,
  handleGeneratedDocumentDeleted,
} = useMedicalRecord({
  patientId: params.id,
  onPatientNotFound: handlePatientNotFound,
});

  const timelineEvents = medicalRecord
  ? buildTimelineEvents(
      medicalRecord,
      toothHistory,
    )
  : [];

  

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

            <MedicalRecordStats
              historyCount={
                medicalRecord.allergies.length +
                medicalRecord.conditions.length +
                medicalRecord.medications.length
              }
              evolutionsCount={medicalRecord.evolutions.length}
              prescriptionsCount={
                medicalRecord.prescriptions.length
              }
              consultationsCount={
                medicalRecord.consultations.length
              }
            />

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



           {activeTab === "timeline" && (
            <ClinicalTimeline
               events={timelineEvents}
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

{activeTab === "documents" && (
  <div className="space-y-8">
    <GeneratedDocuments
      patientId={patient.id}
      documents={generatedDocuments}
      onDelete={handleGeneratedDocumentDeleted}
    />

    <div className="border-t pt-8">
      <div className="mb-5">
        <h2 className="text-lg font-bold">
          Arquivos anexados
        </h2>

        <p className="text-sm text-muted-foreground">
          Radiografias, exames, laudos, imagens e PDFs
          enviados ao prontuário.
        </p>
      </div>

      <div className="space-y-6">
        <MedicalDocumentForm
          patientId={patient.id}
          onSave={handleDocumentCreated}
        />

        <MedicalDocuments
          documents={documents}
          onDelete={handleDocumentDeleted}
        />
      </div>
    </div>
  </div>
)}

{activeTab === "odontogram" && (
  <Odontogram
    teeth={teeth}
    history={toothHistory}
    onToothUpdate={handleToothUpdate}
  />
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