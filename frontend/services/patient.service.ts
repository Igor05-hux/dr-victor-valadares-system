import type { Patient } from "@/types/patient";

const patientsMock: Patient[] = [
  {
    id: "patient-1",
    name: "Mariana Oliveira",
    email: "mariana.oliveira@email.com",
    phone: "(31) 99999-1201",
    birthDate: "1994-05-18",
    lastAppointment: "2026-07-10",
    nextAppointment: "2026-07-22",
    status: "Ativo",
  },
  {
    id: "patient-2",
    name: "Carlos Henrique",
    email: "carlos.henrique@email.com",
    phone: "(31) 98888-7845",
    birthDate: "1987-09-03",
    lastAppointment: "2026-07-14",
    status: "Ativo",
  },
  {
    id: "patient-3",
    name: "Amanda Souza",
    email: "amanda.souza@email.com",
    phone: "(31) 97777-4562",
    birthDate: "1999-02-27",
    lastAppointment: "2026-06-28",
    nextAppointment: "2026-07-25",
    status: "Ativo",
  },
  {
    id: "patient-4",
    name: "Rafael Martins",
    email: "rafael.martins@email.com",
    phone: "(31) 96666-8010",
    birthDate: "1978-11-12",
    lastAppointment: "2026-05-30",
    status: "Inativo",
  },
];

export async function getPatients(): Promise<Patient[]> {
  return Promise.resolve(patientsMock);
}