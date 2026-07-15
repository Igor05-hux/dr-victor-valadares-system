import type { MedicalRecord } from "@/types/medical-record";

const medicalRecordsMock: MedicalRecord[] = [
  {
    patientId: "patient-1",
    allergies: [
      {
        id: "allergy-1",
        title: "Dipirona",
        description: "Relata reação alérgica com coceira.",
      },
    ],
    conditions: [
      {
        id: "condition-1",
        title: "Hipertensão",
        description: "Controlada com acompanhamento médico.",
      },
    ],
    medications: [
      {
        id: "medication-1",
        title: "Losartana",
        description: "Uso contínuo.",
      },
    ],
    consultations: [
      {
        id: "consultation-1",
        date: "2026-07-14",
        title: "Avaliação odontológica",
        description:
          "Paciente apresentou sensibilidade no segundo molar inferior.",
        professional: "Dr. Victor Valadares",
      },
      {
        id: "consultation-2",
        date: "2026-07-10",
        title: "Limpeza",
        description:
          "Realizada profilaxia e orientação de higiene bucal.",
        professional: "Dr. Victor Valadares",
      },
    ],
  },
  {
    patientId: "patient-2",
    allergies: [],
    conditions: [],
    medications: [],
    consultations: [
      {
        id: "consultation-3",
        date: "2026-07-14",
        title: "Retorno",
        description:
          "Avaliação após procedimento de restauração.",
        professional: "Dr. Victor Valadares",
      },
    ],
  },
];

export async function getMedicalRecordByPatientId(
  patientId: string,
): Promise<MedicalRecord> {
  const record = medicalRecordsMock.find(
    (item) => item.patientId === patientId,
  );

  return (
    record ?? {
      patientId,
      allergies: [],
      conditions: [],
      medications: [],
      consultations: [],
    }
  );
}