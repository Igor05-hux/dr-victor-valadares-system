"use client";

import {
  Download,
  ExternalLink,
  FileImage,
  FileText,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import type { MedicalDocument } from "@/types/medical-document";

interface MedicalDocumentsProps {
  documents: MedicalDocument[];
  onDelete: (documentId: string) => Promise<void>;
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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

function dataUrlToBlob(dataUrl: string): Blob {
  const [metadata, encodedData] = dataUrl.split(",");

  if (!metadata || !encodedData) {
    throw new Error("Arquivo inválido.");
  }

  const mimeTypeMatch = metadata.match(
    /data:(.*?);base64/,
  );

  const mimeType =
    mimeTypeMatch?.[1] ??
    "application/octet-stream";

  const binaryData = window.atob(encodedData);
  const bytes = new Uint8Array(binaryData.length);

  for (
    let index = 0;
    index < binaryData.length;
    index += 1
  ) {
    bytes[index] = binaryData.charCodeAt(index);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}

function createDocumentUrl(
  document: MedicalDocument,
): string {
  const blob = dataUrlToBlob(document.dataUrl);

  return URL.createObjectURL(blob);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function MedicalDocuments({
  documents,
  onDelete,
}: MedicalDocumentsProps) {
  const [deletingDocumentId, setDeletingDocumentId] =
    useState<string | null>(null);

  function handleOpenDocument(
    document: MedicalDocument,
  ) {
    try {
      const previewWindow = window.open(
        "",
        "_blank",
      );

      if (!previewWindow) {
        window.alert(
          "O navegador bloqueou a abertura. Permita pop-ups para este site.",
        );
        return;
      }

      const documentUrl =
        createDocumentUrl(document);

      const isImage =
        document.mimeType.startsWith("image/");

      const safeName = escapeHtml(document.name);
      const safeFileName = escapeHtml(
        document.fileName,
      );

      previewWindow.document.open();

      previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>${safeName}</title>

            <style>
              * {
                box-sizing: border-box;
              }

              html,
              body {
                margin: 0;
                min-height: 100%;
              }

              body {
                background: #18181b;
                color: #ffffff;
                font-family: Arial, sans-serif;
              }

              header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                min-height: 64px;
                padding: 12px 20px;
                background: #ffffff;
                color: #18181b;
                border-bottom: 1px solid #e4e4e7;
              }

              h1 {
                margin: 0;
                overflow: hidden;
                font-size: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              a {
                flex-shrink: 0;
                border-radius: 8px;
                background: #2563eb;
                padding: 10px 16px;
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                text-decoration: none;
              }

              main {
                display: flex;
                min-height: calc(100vh - 64px);
                align-items: center;
                justify-content: center;
                overflow: auto;
              }

              img {
                display: block;
                max-width: 100%;
                max-height: calc(100vh - 64px);
                object-fit: contain;
              }

              iframe {
                display: block;
                width: 100%;
                height: calc(100vh - 64px);
                border: 0;
                background: #ffffff;
              }
            </style>
          </head>

          <body>
            <header>
              <h1>${safeName}</h1>

              <a
                href="${documentUrl}"
                download="${safeFileName}"
              >
                Baixar arquivo
              </a>
            </header>

            <main>
              ${
                isImage
                  ? `
                    <img
                      src="${documentUrl}"
                      alt="${safeName}"
                    />
                  `
                  : `
                    <iframe
                      src="${documentUrl}"
                      title="${safeName}"
                    ></iframe>
                  `
              }
            </main>
          </body>
        </html>
      `);

      previewWindow.document.close();

      previewWindow.addEventListener(
        "beforeunload",
        () => {
          URL.revokeObjectURL(documentUrl);
        },
      );
    } catch {
      window.alert(
        "Não foi possível abrir o documento.",
      );
    }
  }

  function handleDownloadDocument(
    document: MedicalDocument,
  ) {
    try {
      const documentUrl =
        createDocumentUrl(document);

      const link =
        window.document.createElement("a");

      link.href = documentUrl;
      link.download = document.fileName;
      link.style.display = "none";

      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      window.setTimeout(() => {
        URL.revokeObjectURL(documentUrl);
      }, 1_000);
    } catch {
      window.alert(
        "Não foi possível baixar o documento.",
      );
    }
  }

  async function handleDeleteDocument(
    documentId: string,
  ) {
    const shouldDelete = window.confirm(
      "Deseja realmente excluir este documento?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingDocumentId(documentId);
      await onDelete(documentId);
    } finally {
      setDeletingDocumentId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText
            size={22}
            className="text-muted-foreground"
          />
        </div>

        <h2 className="mt-4 font-semibold">
          Nenhum documento enviado
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Radiografias, exames, laudos e termos aparecerão
          aqui.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((document) => {
        const isImage =
          document.mimeType.startsWith("image/");

        const isDeleting =
          deletingDocumentId === document.id;

        return (
          <article
            key={document.id}
            className="overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            {isImage ? (
              <button
                type="button"
                onClick={() =>
                  handleOpenDocument(document)
                }
                className="block h-44 w-full overflow-hidden bg-muted"
              >
                <img
                  src={document.dataUrl}
                  alt={document.name}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleOpenDocument(document)
                }
                className="flex h-44 w-full items-center justify-center bg-muted"
              >
                <FileText
                  size={54}
                  className="text-red-600"
                />
              </button>
            )}

            <div className="p-5">
              <div className="flex items-start gap-3">
                {isImage ? (
                  <FileImage className="mt-0.5 shrink-0 text-blue-600" />
                ) : (
                  <FileText className="mt-0.5 shrink-0 text-red-600" />
                )}

                <div className="min-w-0">
                  <h3 className="truncate font-semibold">
                    {document.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {document.fileName}
                  </p>
                </div>
              </div>

              {document.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {document.description}
                </p>
              )}

              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <p>{formatFileSize(document.size)}</p>
                <p>{formatDate(document.createdAt)}</p>
                <p>{document.professional}</p>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenDocument(document)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  <ExternalLink size={16} />
                  Abrir
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadDocument(document)
                  }
                  title="Baixar documento"
                  className="rounded-xl border px-3 transition hover:bg-muted"
                >
                  <Download size={17} />
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() =>
                    void handleDeleteDocument(
                      document.id,
                    )
                  }
                  title="Excluir documento"
                  className="rounded-xl border px-3 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2
                    size={17}
                    className="text-red-600"
                  />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}