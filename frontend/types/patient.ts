export type PatientStatus = "Ativo" | "Inativo";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf?: string;
  address?: string;
  notes?: string;
  lastAppointment: string;
  nextAppointment?: string;
  status: PatientStatus;
}

export type CreatePatientInput = Omit<
  Patient,
  "id" | "lastAppointment" | "nextAppointment" | "status"
>;