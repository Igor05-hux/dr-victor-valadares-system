import type { Appointment } from "@/types/appointment";

const appointmentsMock: Appointment[] = [
  {
    id: "appointment-1",
    time: "08:30",
    patient: "Mariana Oliveira",
    procedure: "Avaliação",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
  {
    id: "appointment-2",
    time: "10:00",
    patient: "Carlos Henrique",
    procedure: "Limpeza",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
  {
    id: "appointment-3",
    time: "13:30",
    patient: "Amanda Souza",
    procedure: "Restauração",
    professional: "Dr. Victor Valadares",
    status: "Pendente",
  },
  {
    id: "appointment-4",
    time: "15:00",
    patient: "Rafael Martins",
    procedure: "Retorno",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
];

export async function getAppointments(): Promise<Appointment[]> {
  // Enquanto o backend ainda não existe, retornamos os dados mockados.
  return Promise.resolve(appointmentsMock);
}