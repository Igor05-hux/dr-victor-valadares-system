export interface MedicalHistoryItem {
  id: string;
  title: string;
  description?: string;
}

export interface ConsultationRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  professional: string;
}

export interface MedicalRecord {
  patientId: string;
  allergies: MedicalHistoryItem[];
  conditions: MedicalHistoryItem[];
  medications: MedicalHistoryItem[];
  consultations: ConsultationRecord[];
}