import type { Appointment } from "@/types/appointment";

const appointmentsMock: Appointment[] = [
  {
    id: "1",
    time: "08:30",
    patient: "Mariana Oliveira",
    procedure: "Avaliação",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
  {
    id: "2",
    time: "10:00",
    patient: "Carlos Henrique",
    procedure: "Limpeza",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
  {
    id: "3",
    time: "13:30",
    patient: "Amanda Souza",
    procedure: "Restauração",
    professional: "Dr. Victor Valadares",
    status: "Pendente",
  },
  {
    id: "4",
    time: "15:00",
    patient: "Rafael Martins",
    procedure: "Retorno",
    professional: "Dr. Victor Valadares",
    status: "Confirmada",
  },
];

export async function getAppointments(): Promise<Appointment[]> {
  return appointmentsMock;
}