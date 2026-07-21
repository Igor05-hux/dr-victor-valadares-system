export type AppointmentStatus =
  | "Confirmada"
  | "Pendente"
  | "Cancelada"
  | "Concluída";

export interface Appointment {
  id: string;
  patientId: string;
  patient: string;
  procedure: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  patient: string;
  procedure: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
}

export type UpdateAppointmentInput =
  CreateAppointmentInput;