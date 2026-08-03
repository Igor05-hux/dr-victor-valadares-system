import type {
  CreateGeneratedDocumentInput,
  GeneratedDocument,
  UpdateGeneratedDocumentInput,
} from "@/types/generated-document";

const STORAGE_KEY =
  "victor-valadares-generated-documents";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveGeneratedDocuments(
  documents: GeneratedDocument[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(documents),
  );
}

async function getStoredGeneratedDocuments(): Promise<
  GeneratedDocument[]
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
    ) as GeneratedDocument[];

    return Array.isArray(parsedDocuments)
      ? parsedDocuments
      : [];
  } catch {
    return [];
  }
}

function sortGeneratedDocuments(
  documents: GeneratedDocument[],
): GeneratedDocument[] {
  return [...documents].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export async function getGeneratedDocuments(): Promise<
  GeneratedDocument[]
> {
  return sortGeneratedDocuments(
    await getStoredGeneratedDocuments(),
  );
}

export async function getGeneratedDocumentsByPatientId(
  patientId: string,
): Promise<GeneratedDocument[]> {
  const documents =
    await getStoredGeneratedDocuments();

  return sortGeneratedDocuments(
    documents.filter(
      (document) =>
        document.patientId === patientId,
    ),
  );
}

export async function createGeneratedDocument(
  input: CreateGeneratedDocumentInput,
): Promise<GeneratedDocument> {
  if (!isBrowser()) {
    throw new Error(
      "O documento precisa ser criado no navegador.",
    );
  }

  if (!input.patientId) {
    throw new Error("Selecione um paciente.");
  }

  if (!input.templateId) {
    throw new Error("Selecione um modelo.");
  }

  if (!input.title.trim()) {
    throw new Error(
      "Informe o título do documento.",
    );
  }

  if (!input.content.trim()) {
    throw new Error(
      "O conteúdo do documento não pode ficar vazio.",
    );
  }

  const documents =
    await getStoredGeneratedDocuments();

  const newDocument: GeneratedDocument = {
    id: crypto.randomUUID(),
    patientId: input.patientId,
    patientName: input.patientName,
    templateId: input.templateId,
    templateName: input.templateName,
    category: input.category,
    title: input.title.trim(),
    content: input.content.trim(),
    professional: input.professional.trim(),
    createdAt: new Date().toISOString(),
  };

  saveGeneratedDocuments([
    newDocument,
    ...documents,
  ]);

  return newDocument;
}

export async function updateGeneratedDocument(
  documentId: string,
  input: UpdateGeneratedDocumentInput,
): Promise<GeneratedDocument> {
  if (!isBrowser()) {
    throw new Error(
      "O documento precisa ser editado no navegador.",
    );
  }

  const documents =
    await getStoredGeneratedDocuments();

  const existingDocument = documents.find(
    (document) =>
      document.id === documentId,
  );

  if (!existingDocument) {
    throw new Error(
      "Documento gerado não encontrado.",
    );
  }

  const updatedDocument: GeneratedDocument = {
    ...existingDocument,
    title: input.title.trim(),
    content: input.content.trim(),
    updatedAt: new Date().toISOString(),
  };

  saveGeneratedDocuments(
    documents.map((document) =>
      document.id === documentId
        ? updatedDocument
        : document,
    ),
  );

  return updatedDocument;
}

export async function deleteGeneratedDocument(
  documentId: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "O documento precisa ser excluído no navegador.",
    );
  }

  const documents =
    await getStoredGeneratedDocuments();

  saveGeneratedDocuments(
    documents.filter(
      (document) =>
        document.id !== documentId,
    ),
  );
}