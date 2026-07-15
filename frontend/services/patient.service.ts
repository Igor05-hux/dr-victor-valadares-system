import type {
  CreatePatientInput,
  Patient,
} from "@/types/patient";

const STORAGE_KEY = "victor-valadares-patients";

const defaultPatients: Patient[] = [
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
];

function isBrowser() {
  return typeof window !== "undefined";
}

export async function getPatients(): Promise<Patient[]> {
  if (!isBrowser()) {
    return defaultPatients;
  }

  const storedPatients = localStorage.getItem(STORAGE_KEY);

  if (!storedPatients) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultPatients),
    );

    return defaultPatients;
  }

  return JSON.parse(storedPatients) as Patient[];
}

export async function createPatient(
  input: CreatePatientInput,
): Promise<Patient> {
  if (!isBrowser()) {
    throw new Error(
      "O cadastro de paciente precisa ser executado no navegador.",
    );
  }

  const patients = await getPatients();

  const newPatient: Patient = {
    id: crypto.randomUUID(),
    ...input,
    lastAppointment: "Nenhuma",
    status: "Ativo",
  };

  const updatedPatients = [...patients, newPatient];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedPatients),
  );

  return newPatient;
}