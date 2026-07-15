export type AppointmentStatus =
  | "Confirmada"
  | "Pendente"
  | "Cancelada"
  | "Concluída";

export interface Appointment {
  id: string;
  time: string;
  patient: string;
  procedure: string;
  professional: string;
  status: AppointmentStatus;
}