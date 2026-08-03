import { defaultDocumentTemplates } from "@/data/default-document-templates";
import type {
  CreateDocumentTemplateInput,
  DocumentTemplate,
  UpdateDocumentTemplateInput,
} from "@/types/document-template";

const STORAGE_KEY =
  "victor-valadares-document-templates";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveTemplates(
  templates: DocumentTemplate[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(templates),
  );
}

function sortTemplates(
  templates: DocumentTemplate[],
): DocumentTemplate[] {
  return [...templates].sort((first, second) =>
    first.name.localeCompare(
      second.name,
      "pt-BR",
    ),
  );
}

function validateTemplateInput(
  input: CreateDocumentTemplateInput,
): void {
  if (!input.name.trim()) {
    throw new Error(
      "Informe o nome do modelo.",
    );
  }

  if (!input.description.trim()) {
    throw new Error(
      "Informe a descrição do modelo.",
    );
  }

  if (!input.content.trim()) {
    throw new Error(
      "O conteúdo do modelo não pode ficar vazio.",
    );
  }
}

export async function getDocumentTemplates(): Promise<
  DocumentTemplate[]
> {
  if (!isBrowser()) {
    return sortTemplates(
      defaultDocumentTemplates,
    );
  }

  const storedTemplates =
    localStorage.getItem(STORAGE_KEY);

  if (!storedTemplates) {
    saveTemplates(defaultDocumentTemplates);

    return sortTemplates(
      defaultDocumentTemplates,
    );
  }

  try {
    const parsedTemplates = JSON.parse(
      storedTemplates,
    ) as DocumentTemplate[];

    if (!Array.isArray(parsedTemplates)) {
      saveTemplates(defaultDocumentTemplates);

      return sortTemplates(
        defaultDocumentTemplates,
      );
    }

    const storedTemplateIds = new Set(
      parsedTemplates.map(
        (template) => template.id,
      ),
    );

    const missingDefaultTemplates =
      defaultDocumentTemplates.filter(
        (template) =>
          !storedTemplateIds.has(template.id),
      );

    const synchronizedTemplates = [
      ...parsedTemplates,
      ...missingDefaultTemplates,
    ];

    if (missingDefaultTemplates.length > 0) {
      saveTemplates(
        synchronizedTemplates,
      );
    }

    return sortTemplates(
      synchronizedTemplates,
    );
  } catch {
    saveTemplates(defaultDocumentTemplates);

    return sortTemplates(
      defaultDocumentTemplates,
    );
  }
}

export async function getDocumentTemplateById(
  templateId: string,
): Promise<DocumentTemplate | null> {
  const templates =
    await getDocumentTemplates();

  return (
    templates.find(
      (template) =>
        template.id === templateId,
    ) ?? null
  );
}

export async function createDocumentTemplate(
  input: CreateDocumentTemplateInput,
): Promise<DocumentTemplate> {
  if (!isBrowser()) {
    throw new Error(
      "O modelo precisa ser criado no navegador.",
    );
  }

  validateTemplateInput(input);

  const templates =
    await getDocumentTemplates();

  const newTemplate: DocumentTemplate = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    content: input.content.trim(),
    isDefault: false,
    isActive: input.isActive,
    createdAt: new Date().toISOString(),
  };

  saveTemplates([
    ...templates,
    newTemplate,
  ]);

  return newTemplate;
}

export async function updateDocumentTemplate(
  templateId: string,
  input: UpdateDocumentTemplateInput,
): Promise<DocumentTemplate> {
  if (!isBrowser()) {
    throw new Error(
      "O modelo precisa ser editado no navegador.",
    );
  }

  validateTemplateInput(input);

  const templates =
    await getDocumentTemplates();

  const existingTemplate = templates.find(
    (template) =>
      template.id === templateId,
  );

  if (!existingTemplate) {
    throw new Error(
      "Modelo de documento não encontrado.",
    );
  }

  const updatedTemplate: DocumentTemplate = {
    ...existingTemplate,
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    content: input.content.trim(),
    isActive: input.isActive,
    updatedAt: new Date().toISOString(),
  };

  const updatedTemplates = templates.map(
    (template) =>
      template.id === templateId
        ? updatedTemplate
        : template,
  );

  saveTemplates(updatedTemplates);

  return updatedTemplate;
}

export async function deleteDocumentTemplate(
  templateId: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "O modelo precisa ser excluído no navegador.",
    );
  }

  const templates =
    await getDocumentTemplates();

  const template = templates.find(
    (item) => item.id === templateId,
  );

  if (!template) {
    throw new Error(
      "Modelo de documento não encontrado.",
    );
  }

  if (template.isDefault) {
    throw new Error(
      "Os modelos padrão não podem ser excluídos. Você pode desativá-los ou editar seu conteúdo.",
    );
  }

  saveTemplates(
    templates.filter(
      (item) => item.id !== templateId,
    ),
  );
}

export async function restoreDefaultDocumentTemplate(
  templateId: string,
): Promise<DocumentTemplate> {
  if (!isBrowser()) {
    throw new Error(
      "O modelo precisa ser restaurado no navegador.",
    );
  }

  const originalTemplate =
    defaultDocumentTemplates.find(
      (template) =>
        template.id === templateId,
    );

  if (!originalTemplate) {
    throw new Error(
      "O conteúdo original deste modelo não foi encontrado.",
    );
  }

  const templates =
    await getDocumentTemplates();

  const restoredTemplate: DocumentTemplate = {
    ...originalTemplate,
    updatedAt: new Date().toISOString(),
  };

  const templateExists = templates.some(
    (template) =>
      template.id === templateId,
  );

  const updatedTemplates = templateExists
    ? templates.map((template) =>
        template.id === templateId
          ? restoredTemplate
          : template,
      )
    : [...templates, restoredTemplate];

  saveTemplates(updatedTemplates);

  return restoredTemplate;
}