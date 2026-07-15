export type PatientStatus = "Ativo" | "Inativo";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  lastAppointment: string;
  nextAppointment?: string;
  status: PatientStatus;
}