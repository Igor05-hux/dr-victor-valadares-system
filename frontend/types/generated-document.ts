import type { DocumentTemplateCategory } from "@/types/document-template";

export interface GeneratedDocument {
  id: string;
  patientId: string;
  patientName: string;
  templateId: string;
  templateName: string;
  category: DocumentTemplateCategory;
  title: string;
  content: string;
  professional: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGeneratedDocumentInput {
  patientId: string;
  patientName: string;
  templateId: string;
  templateName: string;
  category: DocumentTemplateCategory;
  title: string;
  content: string;
  professional: string;
}

export type UpdateGeneratedDocumentInput = Pick<
  GeneratedDocument,
  "title" | "content"
>;