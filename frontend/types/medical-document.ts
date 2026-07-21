export type MedicalDocumentType =
  | "radiography"
  | "exam"
  | "report"
  | "consent"
  | "other";

export interface MedicalDocument {
  id: string;
  patientId: string;
  name: string;
  description?: string;
  type: MedicalDocumentType;
  fileName: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  createdAt: string;
  professional: string;
}

export interface CreateMedicalDocumentInput {
  patientId: string;
  name: string;
  description?: string;
  type: MedicalDocumentType;
  file: File;
  professional: string;
}

export interface MedicalDocumentTypeOption {
  value: MedicalDocumentType;
  label: string;
}

export const medicalDocumentTypeOptions: MedicalDocumentTypeOption[] =
  [
    {
      value: "radiography",
      label: "Radiografia",
    },
    {
      value: "exam",
      label: "Exame",
    },
    {
      value: "report",
      label: "Laudo",
    },
    {
      value: "consent",
      label: "Termo de consentimento",
    },
    {
      value: "other",
      label: "Outro documento",
    },
  ];