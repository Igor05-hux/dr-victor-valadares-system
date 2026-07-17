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

export interface ClinicalEvolution {
  id: string;
  date: string;
  professional: string;
  procedure?: string;
  description: string;
  returnRecommendation?: string;
}

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  duration?: string;
}

export interface Prescription {
  id: string;
  date: string;
  professional: string;
  items: PrescriptionItem[];
  observations?: string;
}

export interface MedicalRecord {
  patientId: string;
  allergies: MedicalHistoryItem[];
  conditions: MedicalHistoryItem[];
  medications: MedicalHistoryItem[];
  consultations: ConsultationRecord[];
  evolutions: ClinicalEvolution[];
  prescriptions: Prescription[];
}