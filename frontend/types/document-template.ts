export type DocumentTemplateCategory =
  | "declaration"
  | "consent"
  | "contract"
  | "authorization"
  | "guidance"
  | "anamnesis"
  | "other";

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentTemplateCategory;
  content: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDocumentTemplateInput {
  name: string;
  description: string;
  category: DocumentTemplateCategory;
  content: string;
  isActive: boolean;
}

export type UpdateDocumentTemplateInput =
  CreateDocumentTemplateInput;

export interface DocumentTemplateCategoryOption {
  value: DocumentTemplateCategory;
  label: string;
}

export const documentTemplateCategoryOptions: DocumentTemplateCategoryOption[] =
  [
    {
      value: "declaration",
      label: "Declarações e atestados",
    },
    {
      value: "consent",
      label: "Termos de consentimento",
    },
    {
      value: "contract",
      label: "Contratos",
    },
    {
      value: "authorization",
      label: "Autorizações",
    },
    {
      value: "guidance",
      label: "Orientações e cuidados",
    },
    {
      value: "anamnesis",
      label: "Anamneses",
    },
    {
      value: "other",
      label: "Outros documentos",
    },
  ];