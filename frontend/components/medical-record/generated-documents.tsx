"use client";

import {
  Eye,
  FileDown,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { openDocumentForPrint } from "@/services/document-print.service";
import {
  documentTemplateCategoryOptions,
  type DocumentTemplateCategory,
} from "@/types/document-template";
import type { GeneratedDocument } from "@/types/generated-document";
import {
  clinicConfig,
  professionalConfig,
} from "@/config/clinic";

interface GeneratedDocumentsProps {
  patientId: string;
  documents: GeneratedDocument[];
  onDelete: (documentId: string) => Promise<void>;
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function getCategoryLabel(
  category: DocumentTemplateCategory,
): string {
  return (
    documentTemplateCategoryOptions.find(
      (option) => option.value === category,
    )?.label ?? "Outro documento"
  );
}

export function GeneratedDocuments({
  patientId,
  documents,
  onDelete,
}: GeneratedDocumentsProps) {
  const [deletingDocumentId, setDeletingDocumentId] =
    useState<string | null>(null);

  function handleOpenDocument(
    document: GeneratedDocument,
  ): void {
    openDocumentForPrint({
      title: document.title,
      content: document.content,
      patientName: document.patientName,
      professionalName: document.professional,
      professionalCro:
  professionalConfig.cro,
clinicName:
  clinicConfig.name,
clinicCity:
  clinicConfig.city,
clinicState:
  clinicConfig.state,
    });
  }

  async function handleDeleteDocument(
    document: GeneratedDocument,
  ): Promise<void> {
    const shouldDelete = window.confirm(
      `Deseja realmente excluir o documento "${document.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingDocumentId(document.id);
      await onDelete(document.id);
    } finally {
      setDeletingDocumentId(null);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">
            Documentos gerados
          </h2>

          <p className="text-sm text-muted-foreground">
            Atestados, contratos, consentimentos e
            autorizações criados pelo sistema.
          </p>
        </div>

        <Link
          href={`/documentos/gerar?patientId=${patientId}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Gerar documento
        </Link>
      </header>

      {documents.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText
              size={22}
              className="text-muted-foreground"
            />
          </div>

          <h3 className="mt-4 font-semibold">
            Nenhum documento gerado
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Gere atestados, contratos e termos para este
            paciente.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => {
            const isDeleting =
              deletingDocumentId === document.id;

            return (
              <article
                key={document.id}
                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {document.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {document.templateName}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {getCategoryLabel(document.category)}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p>{formatDate(document.createdAt)}</p>
                  <p>{document.professional}</p>

                  {document.updatedAt && (
                    <p>
                      Atualizado em{" "}
                      {formatDate(document.updatedAt)}
                    </p>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDocument(document)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                  >
                    <Eye size={16} />
                    Visualizar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDocument(document)
                    }
                    title="Imprimir ou salvar como PDF"
                    className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                  >
                    <FileDown size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() =>
                      void handleDeleteDocument(document)
                    }
                    title="Excluir documento"
                    className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
                  >
                    <Trash2
                      size={17}
                      className="text-red-600"
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}