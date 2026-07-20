import {
  permanentTeeth,
  type Odontogram,
  type Tooth,
  type ToothHistoryEntry,
} from "@/types/odontogram";

const STORAGE_KEY = "victor-valadares-odontograms";

function isBrowser() {
  return typeof window !== "undefined";
}

function createDefaultTeeth(): Tooth[] {
  return permanentTeeth.map((tooth) => ({
    ...tooth,
  }));
}

function createHistoryId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `history-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function getStoredOdontograms(): Odontogram[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedData = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as Odontogram[];
  } catch {
    return [];
  }
}

function saveStoredOdontograms(
  odontograms: Odontogram[],
) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(odontograms),
  );
}

export async function getOdontogramByPatientId(
  patientId: string,
): Promise<Odontogram> {
  const odontograms = getStoredOdontograms();

  const existingOdontogram = odontograms.find(
    (odontogram) =>
      odontogram.patientId === patientId,
  );

  if (existingOdontogram) {
    return {
      ...existingOdontogram,
      teeth: existingOdontogram.teeth.map((tooth) => ({
        ...tooth,
      })),
      history: [...(existingOdontogram.history ?? [])],
    };
  }

  const newOdontogram: Odontogram = {
    patientId,
    teeth: createDefaultTeeth(),
    history: [],
    updatedAt: new Date().toISOString(),
  };

  saveStoredOdontograms([
    ...odontograms,
    newOdontogram,
  ]);

  return newOdontogram;
}

export async function updateOdontogramTooth(
  patientId: string,
  updatedTooth: Tooth,
): Promise<Odontogram> {
  const odontograms = getStoredOdontograms();

  const existingOdontogram = odontograms.find(
    (odontogram) =>
      odontogram.patientId === patientId,
  );

  const currentTeeth =
    existingOdontogram?.teeth ?? createDefaultTeeth();

  const previousTooth = currentTeeth.find(
    (tooth) => tooth.number === updatedTooth.number,
  );

  if (!previousTooth) {
    throw new Error("Dente não encontrado.");
  }

  const hasStatusChanged =
    previousTooth.status !== updatedTooth.status;

  const hasNotesChanged =
    (previousTooth.notes ?? "") !==
    (updatedTooth.notes ?? "");

  if (!hasStatusChanged && !hasNotesChanged) {
    return {
      patientId,
      teeth: currentTeeth,
      history: existingOdontogram?.history ?? [],
      updatedAt:
        existingOdontogram?.updatedAt ??
        new Date().toISOString(),
    };
  }

  const updatedTeeth = currentTeeth.map((tooth) =>
    tooth.number === updatedTooth.number
      ? { ...updatedTooth }
      : tooth,
  );

  const historyEntry: ToothHistoryEntry = {
    id: createHistoryId(),
    toothNumber: updatedTooth.number,
    toothName: updatedTooth.name,
    previousStatus: previousTooth.status,
    newStatus: updatedTooth.status,
    previousNotes: previousTooth.notes,
    newNotes: updatedTooth.notes,
    professional: "Dr. Victor Valadares",
    createdAt: new Date().toISOString(),
  };

  const updatedOdontogram: Odontogram = {
    patientId,
    teeth: updatedTeeth,
    history: [
      historyEntry,
      ...(existingOdontogram?.history ?? []),
    ],
    updatedAt: new Date().toISOString(),
  };

  const odontogramExists = odontograms.some(
    (odontogram) =>
      odontogram.patientId === patientId,
  );

  const updatedOdontograms = odontogramExists
    ? odontograms.map((odontogram) =>
        odontogram.patientId === patientId
          ? updatedOdontogram
          : odontogram,
      )
    : [...odontograms, updatedOdontogram];

  saveStoredOdontograms(updatedOdontograms);

  return updatedOdontogram;
}