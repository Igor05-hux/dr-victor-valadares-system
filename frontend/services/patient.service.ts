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

export async function getPatientById(
  id: string,
): Promise<Patient | null> {
  const patients = await getPatients();

  return (
    patients.find((patient) => patient.id === id) ?? null
  );
}

export async function updatePatient(
  id: string,
  data: CreatePatientInput,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "A edição de paciente precisa ser executada no navegador.",
    );
  }

  const patients = await getPatients();

  const patientExists = patients.some(
    (patient) => patient.id === id,
  );

  if (!patientExists) {
    throw new Error("Paciente não encontrado.");
  }

  const updatedPatients = patients.map((patient) =>
    patient.id === id
      ? {
          ...patient,
          ...data,
        }
      : patient,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedPatients),
  );
}

export async function deletePatient(
  id: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "A exclusão de paciente precisa ser executada no navegador.",
    );
  }

  const patients = await getPatients();

  const patientExists = patients.some(
    (patient) => patient.id === id,
  );

  if (!patientExists) {
    throw new Error("Paciente não encontrado.");
  }

  const updatedPatients = patients.filter(
    (patient) => patient.id !== id,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedPatients),
  );
}