import type {
  ClinicalEvolution,
  MedicalHistoryItem,
  MedicalRecord,
  Prescription,
} from "@/types/medical-record";

const STORAGE_KEY = "victor-valadares-medical-records";

type MedicalHistoryCategory =
  | "allergies"
  | "conditions"
  | "medications";

const defaultMedicalRecords: MedicalRecord[] = [
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
    evolutions: [
      {
        id: "evolution-1",
        date: "2026-07-14",
        professional: "Dr. Victor Valadares",
        procedure: "Avaliação odontológica",
        description:
          "Paciente apresentou boa evolução clínica, sem dor e com redução da sensibilidade.",
        returnRecommendation:
          "Retorno recomendado em 30 dias.",
      },
    ],
    prescriptions: [
      {
        id: "prescription-1",
        date: "2026-07-14",
        professional: "Dr. Victor Valadares",
        items: [
          {
            id: "prescription-item-1",
            medication: "Amoxicilina",
            dosage: "500 mg",
            instructions:
              "Tomar 1 cápsula de 8 em 8 horas.",
            duration: "7 dias",
          },
        ],
        observations:
          "Utilizar somente conforme orientação profissional.",
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
    evolutions: [],
    prescriptions: [],
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createEmptyMedicalRecord(
  patientId: string,
): MedicalRecord {
  return {
    patientId,
    allergies: [],
    conditions: [],
    medications: [],
    consultations: [],
    evolutions: [],
    prescriptions: [],
  };
}

function normalizeMedicalRecord(
  record: MedicalRecord,
): MedicalRecord {
  return {
    ...record,
    allergies: record.allergies ?? [],
    conditions: record.conditions ?? [],
    medications: record.medications ?? [],
    consultations: record.consultations ?? [],
    evolutions: record.evolutions ?? [],
    prescriptions: record.prescriptions ?? [],
  };
}

function saveMedicalRecords(
  records: MedicalRecord[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  );
}

async function getMedicalRecords(): Promise<
  MedicalRecord[]
> {
  if (!isBrowser()) {
    return defaultMedicalRecords;
  }

  const storedRecords =
    localStorage.getItem(STORAGE_KEY);

  if (!storedRecords) {
    saveMedicalRecords(defaultMedicalRecords);
    return defaultMedicalRecords;
  }

  try {
    const parsedRecords = JSON.parse(
      storedRecords,
    ) as MedicalRecord[];

    const normalizedRecords =
      parsedRecords.map(normalizeMedicalRecord);

    saveMedicalRecords(normalizedRecords);

    return normalizedRecords;
  } catch {
    saveMedicalRecords(defaultMedicalRecords);
    return defaultMedicalRecords;
  }
}

export async function getMedicalRecordByPatientId(
  patientId: string,
): Promise<MedicalRecord> {
  const records = await getMedicalRecords();

  const record = records.find(
    (item) => item.patientId === patientId,
  );

  return record
    ? normalizeMedicalRecord(record)
    : createEmptyMedicalRecord(patientId);
}

export async function addMedicalHistoryItem(
  patientId: string,
  category: MedicalHistoryCategory,
  item: Omit<MedicalHistoryItem, "id">,
): Promise<MedicalHistoryItem> {
  if (!isBrowser()) {
    throw new Error(
      "O prontuário precisa ser atualizado no navegador.",
    );
  }

  const records = await getMedicalRecords();

  const newItem: MedicalHistoryItem = {
    id: crypto.randomUUID(),
    title: item.title,
    description: item.description,
  };

  const recordIndex = records.findIndex(
    (record) => record.patientId === patientId,
  );

  let updatedRecords: MedicalRecord[];

  if (recordIndex === -1) {
    const newRecord =
      createEmptyMedicalRecord(patientId);

    newRecord[category] = [newItem];

    updatedRecords = [...records, newRecord];
  } else {
    updatedRecords = records.map((record) => {
      if (record.patientId !== patientId) {
        return record;
      }

      return {
        ...record,
        [category]: [
          ...record[category],
          newItem,
        ],
      };
    });
  }

  saveMedicalRecords(updatedRecords);

  return newItem;
}

export async function addClinicalEvolution(
  patientId: string,
  input: Omit<ClinicalEvolution, "id">,
): Promise<ClinicalEvolution> {
  if (!isBrowser()) {
    throw new Error(
      "A evolução clínica precisa ser registrada no navegador.",
    );
  }

  const records = await getMedicalRecords();

  const newEvolution: ClinicalEvolution = {
    id: crypto.randomUUID(),
    date: input.date,
    professional: input.professional,
    procedure: input.procedure,
    description: input.description,
    returnRecommendation:
      input.returnRecommendation,
  };

  const recordIndex = records.findIndex(
    (record) => record.patientId === patientId,
  );

  let updatedRecords: MedicalRecord[];

  if (recordIndex === -1) {
    const newRecord =
      createEmptyMedicalRecord(patientId);

    newRecord.evolutions = [newEvolution];

    updatedRecords = [...records, newRecord];
  } else {
    updatedRecords = records.map((record) => {
      if (record.patientId !== patientId) {
        return record;
      }

      return {
        ...record,
        evolutions: [
          newEvolution,
          ...(record.evolutions ?? []),
        ],
      };
    });
  }

  saveMedicalRecords(updatedRecords);

  return newEvolution;
}

export async function addPrescription(
  patientId: string,
  input: Omit<Prescription, "id">,
): Promise<Prescription> {
  if (!isBrowser()) {
    throw new Error(
      "A receita precisa ser registrada no navegador.",
    );
  }

  if (input.items.length === 0) {
    throw new Error(
      "A receita precisa possuir ao menos um medicamento.",
    );
  }

  const records = await getMedicalRecords();

  const newPrescription: Prescription = {
    id: crypto.randomUUID(),
    date: input.date,
    professional: input.professional,
    observations: input.observations,
    items: input.items.map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    })),
  };

  const recordIndex = records.findIndex(
    (record) => record.patientId === patientId,
  );

  let updatedRecords: MedicalRecord[];

  if (recordIndex === -1) {
    const newRecord =
      createEmptyMedicalRecord(patientId);

    newRecord.prescriptions = [newPrescription];

    updatedRecords = [...records, newRecord];
  } else {
    updatedRecords = records.map((record) => {
      if (record.patientId !== patientId) {
        return record;
      }

      return {
        ...record,
        prescriptions: [
          newPrescription,
          ...(record.prescriptions ?? []),
        ],
      };
    });
  }

  saveMedicalRecords(updatedRecords);

  return newPrescription;
}