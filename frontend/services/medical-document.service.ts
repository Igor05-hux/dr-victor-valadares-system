import type {
  CreateMedicalDocumentInput,
  MedicalDocument,
} from "@/types/medical-document";

const STORAGE_KEY =
  "victor-valadares-medical-documents";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveDocuments(
  documents: MedicalDocument[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(documents),
  );
}

async function getDocuments(): Promise<
  MedicalDocument[]
> {
  if (!isBrowser()) {
    return [];
  }

  const storedDocuments =
    localStorage.getItem(STORAGE_KEY);

  if (!storedDocuments) {
    return [];
  }

  try {
    const parsedDocuments = JSON.parse(
      storedDocuments,
    ) as MedicalDocument[];

    return Array.isArray(parsedDocuments)
      ? parsedDocuments
      : [];
  } catch {
    return [];
  }
}

function sortDocumentsByDate(
  documents: MedicalDocument[],
): MedicalDocument[] {
  return [...documents].sort(
    (firstDocument, secondDocument) =>
      new Date(
        secondDocument.createdAt,
      ).getTime() -
      new Date(firstDocument.createdAt).getTime(),
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(
          new Error(
            "Não foi possível processar o arquivo.",
          ),
        );
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        new Error(
          "Ocorreu um erro durante a leitura do arquivo.",
        ),
      );
    };

    reader.readAsDataURL(file);
  });
}

function validateFile(file: File): void {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      "Formato não permitido. Envie uma imagem JPG, PNG, WEBP ou um arquivo PDF.",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "O arquivo deve possuir no máximo 2 MB.",
    );
  }
}

export async function getAllMedicalDocuments(): Promise<
  MedicalDocument[]
> {
  const documents = await getDocuments();

  return sortDocumentsByDate(documents);
}

export async function getMedicalDocumentsByPatientId(
  patientId: string,
): Promise<MedicalDocument[]> {
  const documents = await getDocuments();

  const patientDocuments = documents.filter(
    (document) =>
      document.patientId === patientId,
  );

  return sortDocumentsByDate(patientDocuments);
}

export async function addMedicalDocument(
  input: CreateMedicalDocumentInput,
): Promise<MedicalDocument> {
  if (!isBrowser()) {
    throw new Error(
      "O documento precisa ser enviado pelo navegador.",
    );
  }

  validateFile(input.file);

  const documents = await getDocuments();
  const dataUrl = await fileToDataUrl(input.file);

  const newDocument: MedicalDocument = {
    id: crypto.randomUUID(),
    patientId: input.patientId,
    name: input.name.trim(),
    description: input.description?.trim(),
    type: input.type,
    fileName: input.file.name,
    mimeType: input.file.type,
    size: input.file.size,
    dataUrl,
    createdAt: new Date().toISOString(),
    professional: input.professional.trim(),
  };

  saveDocuments([newDocument, ...documents]);

  return newDocument;
}

export async function deleteMedicalDocument(
  documentId: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "O documento precisa ser excluído pelo navegador.",
    );
  }

  const documents = await getDocuments();

  const updatedDocuments = documents.filter(
    (document) => document.id !== documentId,
  );

  saveDocuments(updatedDocuments);
}