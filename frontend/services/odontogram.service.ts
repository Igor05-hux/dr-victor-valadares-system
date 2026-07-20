import {
  permanentTeeth,
  type Odontogram,
  type Tooth,
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

    return Array.isArray(parsedData)
      ? (parsedData as Odontogram[])
      : [];
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
    };
  }

  const newOdontogram: Odontogram = {
    patientId,
    teeth: createDefaultTeeth(),
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

  const updatedTeeth = currentTeeth.map((tooth) =>
    tooth.number === updatedTooth.number
      ? { ...updatedTooth }
      : tooth,
  );

  const updatedOdontogram: Odontogram = {
    patientId,
    teeth: updatedTeeth,
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