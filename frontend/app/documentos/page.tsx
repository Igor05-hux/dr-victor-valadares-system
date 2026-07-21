"use client";

import {
  Download,
  ExternalLink,
  FileImage,
  FileText,
  Files,
  FolderOpen,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getAllMedicalDocuments,
} from "@/services/medical-document.service";
import { getPatients } from "@/services/patient.service";
import {
  medicalDocumentTypeOptions,
  type MedicalDocument,
  type MedicalDocumentType,
} from "@/types/medical-document";
import type { Patient } from "@/types/patient";

type DocumentFilter =
  | "all"
  | MedicalDocumentType;

interface DocumentWithPatient
  extends MedicalDocument {
  patientName: string;
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
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

function getDocumentTypeLabel(
  type: MedicalDocumentType,
): string {
  return (
    medicalDocumentTypeOptions.find(
      (option) => option.value === type,
    )?.label ?? "Outro documento"
  );
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [metadata, encodedData] =
    dataUrl.split(",");

  if (!metadata || !encodedData) {
    throw new Error("Arquivo inválido.");
  }

  const mimeTypeMatch = metadata.match(
    /data:(.*?);base64/,
  );

  const mimeType =
    mimeTypeMatch?.[1] ??
    "application/octet-stream";

  const binaryData =
    window.atob(encodedData);

  const bytes = new Uint8Array(
    binaryData.length,
  );

  for (
    let index = 0;
    index < binaryData.length;
    index += 1
  ) {
    bytes[index] =
      binaryData.charCodeAt(index);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}

function createDocumentUrl(
  document: MedicalDocument,
): string {
  const blob = dataUrlToBlob(
    document.dataUrl,
  );

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

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<MedicalDocument[]>([]);

  const [patients, setPatients] = useState<
    Patient[]
  >([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedType, setSelectedType] =
    useState<DocumentFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadDocuments(): Promise<void> {
      try {
        setIsLoading(true);

        const [
          storedDocuments,
          storedPatients,
        ] = await Promise.all([
          getAllMedicalDocuments(),
          getPatients(),
        ]);

        setDocuments(storedDocuments);
        setPatients(storedPatients);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDocuments();
  }, []);

  const documentsWithPatients =
    useMemo<DocumentWithPatient[]>(() => {
      return documents.map((document) => {
        const patient = patients.find(
          (item) =>
            item.id === document.patientId,
        );

        return {
          ...document,
          patientName:
            patient?.name ??
            "Paciente não encontrado",
        };
      });
    }, [documents, patients]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return documentsWithPatients.filter(
      (document) => {
        const matchesType =
          selectedType === "all" ||
          document.type === selectedType;

        const searchableContent = [
          document.name,
          document.fileName,
          document.description ?? "",
          document.professional,
          document.patientName,
          getDocumentTypeLabel(
            document.type,
          ),
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableContent.includes(
            normalizedSearch,
          );

        return matchesType && matchesSearch;
      },
    );
  }, [
    documentsWithPatients,
    searchTerm,
    selectedType,
  ]);

  const imageCount = documents.filter(
    (document) =>
      document.mimeType.startsWith("image/"),
  ).length;

  const pdfCount = documents.filter(
    (document) =>
      document.mimeType ===
      "application/pdf",
  ).length;

  function handleOpenDocument(
    document: MedicalDocument,
  ): void {
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

      const safeName = escapeHtml(
        document.name,
      );

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
          URL.revokeObjectURL(
            documentUrl,
          );
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
  ): void {
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

  if (isLoading) {
    return (
      <main className="space-y-6 p-6">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <FolderOpen size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Centro de Documentos
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Consulte radiografias, exames,
              laudos e termos dos pacientes.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de documentos
              </p>

              <strong className="mt-2 block text-3xl">
                {documents.length}
              </strong>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Files size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Imagens
              </p>

              <strong className="mt-2 block text-3xl">
                {imageCount}
              </strong>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FileImage size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Arquivos PDF
              </p>

              <strong className="mt-2 block text-3xl">
                {pdfCount}
              </strong>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <FileText size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="Pesquisar documento, paciente ou profissional..."
              className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(
                event.target
                  .value as DocumentFilter,
              )
            }
            className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              Todos os tipos
            </option>

            {medicalDocumentTypeOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {filteredDocuments.length}{" "}
          {filteredDocuments.length === 1
            ? "documento encontrado"
            : "documentos encontrados"}
        </p>
      </section>

      {filteredDocuments.length === 0 ? (
        <section className="rounded-2xl border bg-card p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FileText
              size={26}
              className="text-muted-foreground"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Nenhum documento encontrado
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Ajuste os filtros ou adicione um
            documento pelo prontuário de um
            paciente.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map(
            (document) => {
              const isImage =
                document.mimeType.startsWith(
                  "image/",
                );

              return (
                <article
                  key={document.id}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenDocument(
                        document,
                      )
                    }
                    className="flex h-44 w-full items-center justify-center overflow-hidden bg-muted"
                  >
                    {isImage ? (
                      <img
                        src={document.dataUrl}
                        alt={document.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <FileText
                        size={58}
                        className="text-red-600"
                      />
                    )}
                  </button>

                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isImage
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isImage ? (
                          <FileImage
                            size={19}
                          />
                        ) : (
                          <FileText
                            size={19}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {document.name}
                        </h2>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {document.fileName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {getDocumentTypeLabel(
                          document.type,
                        )}
                      </span>
                    </div>

                    {document.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {document.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <UserRound
                          size={15}
                          className="shrink-0 text-muted-foreground"
                        />

                        <span className="truncate">
                          {
                            document.patientName
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={15}
                          className="shrink-0 text-muted-foreground"
                        />

                        <span className="truncate">
                          {
                            document.professional
                          }
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(
                          document.size,
                        )}{" "}
                        •{" "}
                        {formatDate(
                          document.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDocument(
                            document,
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                      >
                        <ExternalLink
                          size={16}
                        />
                        Abrir
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadDocument(
                            document,
                          )
                        }
                        title="Baixar documento"
                        className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                      >
                        <Download size={17} />
                      </button>

                      <Link
                        href={`/prontuarios/${document.patientId}`}
                        title="Abrir prontuário"
                        className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                      >
                        <UserRound size={17} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </section>
      )}
    </main>
  );
}