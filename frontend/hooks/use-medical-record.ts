"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  deleteGeneratedDocument,
  getGeneratedDocumentsByPatientId,
} from "@/services/generated-document.service";
import {
  addMedicalDocument,
  deleteMedicalDocument,
  getMedicalDocumentsByPatientId,
} from "@/services/medical-document.service";
import {
  addPrescription,
  getMedicalRecordByPatientId,
} from "@/services/medical-record.service";
import {
  getOdontogramByPatientId,
  updateOdontogramTooth,
} from "@/services/odontogram.service";
import { getPatientById } from "@/services/patient.service";

import type { GeneratedDocument } from "@/types/generated-document";
import type {
  CreateMedicalDocumentInput,
  MedicalDocument,
} from "@/types/medical-document";
import type {
  ClinicalEvolution,
  MedicalHistoryItem,
  MedicalRecord,
  PrescriptionItem,
} from "@/types/medical-record";
import type {
  Tooth,
  ToothHistoryEntry,
} from "@/types/odontogram";
import type { Patient } from "@/types/patient";
import {
  professionalConfig,
} from "@/config/clinic";

type MedicalHistoryCategory =
  | "allergies"
  | "conditions"
  | "medications";

interface UseMedicalRecordOptions {
  patientId: string;
  onPatientNotFound?: () => void;
}

export function useMedicalRecord({
  patientId,
  onPatientNotFound,
}: UseMedicalRecordOptions) {
  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [medicalRecord, setMedicalRecord] =
    useState<MedicalRecord | null>(null);

  const [teeth, setTeeth] = useState<Tooth[]>([]);

  const [toothHistory, setToothHistory] =
    useState<ToothHistoryEntry[]>([]);

  const [documents, setDocuments] = useState<
    MedicalDocument[]
  >([]);

  const [
    generatedDocuments,
    setGeneratedDocuments,
  ] = useState<GeneratedDocument[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadMedicalRecord = useCallback(
    async () => {
      if (!patientId) {
        return;
      }

      setIsLoading(true);

      try {
        const [
          patientData,
          recordData,
          odontogramData,
          documentData,
          generatedDocumentData,
        ] = await Promise.all([
          getPatientById(patientId),
          getMedicalRecordByPatientId(patientId),
          getOdontogramByPatientId(patientId),
          getMedicalDocumentsByPatientId(patientId),
          getGeneratedDocumentsByPatientId(patientId),
        ]);

        if (!patientData) {
          toast.error("Paciente não encontrado.");
          onPatientNotFound?.();
          return;
        }

        setPatient(patientData);
        setMedicalRecord(recordData);
        setTeeth(odontogramData.teeth);
        setToothHistory(
          odontogramData.history ?? [],
        );
        setDocuments(documentData);
        setGeneratedDocuments(
          generatedDocumentData,
        );
      } catch {
        toast.error(
          "Não foi possível carregar o prontuário.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [patientId, onPatientNotFound],
  );

  useEffect(() => {
    void loadMedicalRecord();
  }, [loadMedicalRecord]);

  function handleHistoryItemCreated(
    category: MedicalHistoryCategory,
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
    evolution: ClinicalEvolution,
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
      const prescription =
        await addPrescription(patient.id, {
          date: new Date()
            .toISOString()
            .slice(0, 10),
          professional:
              professionalConfig.name,
          items,
          observations:
            observations.trim() || undefined,
        });

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

      toast.success(
        "Receita salva com sucesso.",
      );
    } catch {
      toast.error(
        "Não foi possível salvar a receita.",
      );
    }
  }

  async function handleToothUpdate(
    updatedTooth: Tooth,
  ) {
    if (!patient) {
      return;
    }

    try {
      const updatedOdontogram =
        await updateOdontogramTooth(
          patient.id,
          updatedTooth,
        );

      setTeeth(updatedOdontogram.teeth);
      setToothHistory(
        updatedOdontogram.history ?? [],
      );

      toast.success(
        `Estado do dente ${updatedTooth.number} atualizado.`,
      );
    } catch {
      toast.error(
        "Não foi possível atualizar o dente.",
      );
    }
  }

  async function handleDocumentCreated(
    input: CreateMedicalDocumentInput,
  ): Promise<void> {
    try {
      const newDocument =
        await addMedicalDocument(input);

      setDocuments((currentDocuments) => [
        newDocument,
        ...currentDocuments,
      ]);

      toast.success(
        "Documento adicionado com sucesso.",
      );
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível adicionar o documento.",
      );

      throw caughtError;
    }
  }

  async function handleDocumentDeleted(
    documentId: string,
  ): Promise<void> {
    try {
      await deleteMedicalDocument(
        documentId,
      );

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) =>
            document.id !== documentId,
        ),
      );

      toast.success(
        "Documento excluído com sucesso.",
      );
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível excluir o documento.",
      );

      throw caughtError;
    }
  }

  async function handleGeneratedDocumentDeleted(
    documentId: string,
  ): Promise<void> {
    try {
      await deleteGeneratedDocument(
        documentId,
      );

      setGeneratedDocuments(
        (currentDocuments) =>
          currentDocuments.filter(
            (document) =>
              document.id !== documentId,
          ),
      );

      toast.success(
        "Documento gerado excluído com sucesso.",
      );
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível excluir o documento.",
      );

      throw caughtError;
    }
  }

  return {
    patient,
    medicalRecord,
    teeth,
    toothHistory,
    documents,
    generatedDocuments,
    isLoading,

    reloadMedicalRecord:
      loadMedicalRecord,
    handleHistoryItemCreated,
    handleEvolutionCreated,
    handlePrescriptionCreated,
    handleToothUpdate,
    handleDocumentCreated,
    handleDocumentDeleted,
    handleGeneratedDocumentDeleted,
  };
}