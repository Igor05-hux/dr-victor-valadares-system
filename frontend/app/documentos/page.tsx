"use client";

import {
  Download,
  ExternalLink,
  FileImage,
  FilePenLine,
  FileText,
  Files,
  FolderOpen,
  Pencil,
  Printer,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { openDocumentForPrint } from "@/services/document-print.service";
import {
  deleteGeneratedDocument,
  getGeneratedDocuments,
} from "@/services/generated-document.service";
import {
  getAllMedicalDocuments,
} from "@/services/medical-document.service";
import { getPatients } from "@/services/patient.service";
import {
  documentTemplateCategoryOptions,
  type DocumentTemplateCategory,
} from "@/types/document-template";
import type { GeneratedDocument } from "@/types/generated-document";
import {
  medicalDocumentTypeOptions,
  type MedicalDocument,
  type MedicalDocumentType,
} from "@/types/medical-document";
import type { Patient } from "@/types/patient";
import {
  clinicConfig,
  professionalConfig,
} from "@/config/clinic";

type DocumentFilter =
  | "all"
  | "generated"
  | "attached"
  | `medical:${MedicalDocumentType}`
  | `generated:${DocumentTemplateCategory}`;

interface MedicalDocumentWithPatient
  extends MedicalDocument {
  patientName: string;
}

type UnifiedDocument =
  | {
      kind: "medical";
      id: string;
      patientId: string;
      patientName: string;
      title: string;
      subtitle: string;
      professional: string;
      createdAt: string;
      searchContent: string;
      medicalDocument: MedicalDocumentWithPatient;
    }
  | {
      kind: "generated";
      id: string;
      patientId: string;
      patientName: string;
      title: string;
      subtitle: string;
      professional: string;
      createdAt: string;
      searchContent: string;
      generatedDocument: GeneratedDocument;
    };

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

function getMedicalDocumentTypeLabel(
  type: MedicalDocumentType,
): string {
  return (
    medicalDocumentTypeOptions.find(
      (option) => option.value === type,
    )?.label ?? "Outro documento"
  );
}

function getGeneratedDocumentCategoryLabel(
  category: DocumentTemplateCategory,
): string {
  return (
    documentTemplateCategoryOptions.find(
      (option) => option.value === category,
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
  const [
    medicalDocuments,
    setMedicalDocuments,
  ] = useState<MedicalDocument[]>([]);

  const [
    generatedDocuments,
    setGeneratedDocuments,
  ] = useState<GeneratedDocument[]>([]);

  const [patients, setPatients] = useState<
    Patient[]
  >([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedType, setSelectedType] =
    useState<DocumentFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    deletingGeneratedDocumentId,
    setDeletingGeneratedDocumentId,
  ] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocuments(): Promise<void> {
      try {
        setIsLoading(true);

        const [
          storedMedicalDocuments,
          storedGeneratedDocuments,
          storedPatients,
        ] = await Promise.all([
          getAllMedicalDocuments(),
          getGeneratedDocuments(),
          getPatients(),
        ]);

        setMedicalDocuments(
          storedMedicalDocuments,
        );

        setGeneratedDocuments(
          storedGeneratedDocuments,
        );

        setPatients(storedPatients);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os documentos.";

        toast.error(
          "Erro ao carregar os documentos.",
          {
            description: message,
          },
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDocuments();
  }, []);

  const medicalDocumentsWithPatients =
    useMemo<MedicalDocumentWithPatient[]>(
      () => {
        return medicalDocuments.map(
          (document) => {
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
          },
        );
      },
      [medicalDocuments, patients],
    );

  const unifiedDocuments =
    useMemo<UnifiedDocument[]>(() => {
      const attachedDocuments: UnifiedDocument[] =
        medicalDocumentsWithPatients.map(
          (document) => ({
            kind: "medical",
            id: document.id,
            patientId: document.patientId,
            patientName: document.patientName,
            title: document.name,
            subtitle: document.fileName,
            professional: document.professional,
            createdAt: document.createdAt,
            searchContent: [
              document.name,
              document.fileName,
              document.description ?? "",
              document.professional,
              document.patientName,
              getMedicalDocumentTypeLabel(
                document.type,
              ),
            ]
              .join(" ")
              .toLocaleLowerCase("pt-BR"),
            medicalDocument: document,
          }),
        );

      const createdDocuments: UnifiedDocument[] =
        generatedDocuments.map(
          (document) => ({
            kind: "generated",
            id: document.id,
            patientId: document.patientId,
            patientName: document.patientName,
            title: document.title,
            subtitle: document.templateName,
            professional: document.professional,
            createdAt: document.createdAt,
            searchContent: [
              document.title,
              document.templateName,
              document.content,
              document.professional,
              document.patientName,
              getGeneratedDocumentCategoryLabel(
                document.category,
              ),
            ]
              .join(" ")
              .toLocaleLowerCase("pt-BR"),
            generatedDocument: document,
          }),
        );

      return [
        ...attachedDocuments,
        ...createdDocuments,
      ].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
    }, [
      generatedDocuments,
      medicalDocumentsWithPatients,
    ]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch =
      searchTerm
        .trim()
        .toLocaleLowerCase("pt-BR");

    return unifiedDocuments.filter(
      (document) => {
        let matchesType = false;

        if (selectedType === "all") {
          matchesType = true;
        } else if (
          selectedType === "generated"
        ) {
          matchesType =
            document.kind === "generated";
        } else if (
          selectedType === "attached"
        ) {
          matchesType =
            document.kind === "medical";
        } else if (
          selectedType.startsWith("medical:")
        ) {
          matchesType =
            document.kind === "medical" &&
            document.medicalDocument.type ===
              selectedType.replace(
                "medical:",
                "",
              );
        } else if (
          selectedType.startsWith("generated:")
        ) {
          matchesType =
            document.kind === "generated" &&
            document.generatedDocument.category ===
              selectedType.replace(
                "generated:",
                "",
              );
        }

        const matchesSearch =
          normalizedSearch.length === 0 ||
          document.searchContent.includes(
            normalizedSearch,
          );

        return matchesType && matchesSearch;
      },
    );
  }, [
    searchTerm,
    selectedType,
    unifiedDocuments,
  ]);

  const imageCount = medicalDocuments.filter(
    (document) =>
      document.mimeType.startsWith("image/"),
  ).length;

  const pdfCount = medicalDocuments.filter(
    (document) =>
      document.mimeType ===
      "application/pdf",
  ).length;

  function handleOpenMedicalDocument(
    document: MedicalDocument,
  ): void {
    try {
      const previewWindow = window.open(
        "",
        "_blank",
      );

      if (!previewWindow) {
        toast.error(
          "O navegador bloqueou a abertura.",
          {
            description:
              "Permita pop-ups para este site e tente novamente.",
          },
        );

        return;
      }

      const documentUrl =
        createDocumentUrl(document);

      const isImage =
        document.mimeType.startsWith(
          "image/",
        );

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
    } catch (error) {
      toast.error(
        "Não foi possível abrir o documento.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    }
  }

  function handleDownloadMedicalDocument(
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

      toast.success(
        "Download iniciado.",
        {
          description: document.fileName,
        },
      );
    } catch (error) {
      toast.error(
        "Não foi possível baixar o documento.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    }
  }

  function handleOpenGeneratedDocument(
    document: GeneratedDocument,
  ): void {
    try {
      openDocumentForPrint({
        title: document.title,
        content: document.content,
        patientName: document.patientName,
        professionalName:
          document.professional,
       professionalCro:
  professionalConfig.cro,
clinicName:
  clinicConfig.name,
clinicCity:
  clinicConfig.city,
clinicState:
  clinicConfig.state,
      });
    } catch (error) {
      toast.error(
        "Não foi possível abrir o documento.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    }
  }

  async function handleDeleteGeneratedDocument(
    document: GeneratedDocument,
  ): Promise<void> {
    const shouldDelete = window.confirm(
      `Deseja realmente excluir o documento "${document.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingGeneratedDocumentId(
        document.id,
      );

      await deleteGeneratedDocument(
        document.id,
      );

      setGeneratedDocuments(
        (currentDocuments) =>
          currentDocuments.filter(
            (item) =>
              item.id !== document.id,
          ),
      );

      toast.success(
        "Documento excluído com sucesso.",
      );
    } catch (error) {
      toast.error(
        "Não foi possível excluir o documento.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    } finally {
      setDeletingGeneratedDocumentId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="space-y-6 p-6">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />

        <div className="grid gap-4 md:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <FolderOpen size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Centro de Documentos
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Consulte arquivos anexados e documentos
              gerados para os pacientes.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/documentos/gerar"
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <FileText size={18} />
            Gerar documento
          </Link>

          <Link
            href="/documentos/modelos"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FilePenLine size={18} />
            Gerenciar modelos
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de documentos
              </p>

              <strong className="mt-2 block text-3xl">
                {unifiedDocuments.length}
              </strong>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Files size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Documentos gerados
              </p>

              <strong className="mt-2 block text-3xl">
                {generatedDocuments.length}
              </strong>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <FileText size={22} />
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

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
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

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              <FileText size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
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
              placeholder="Pesquisar documento, paciente, conteúdo ou profissional..."
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
              Todos os documentos
            </option>

            <option value="generated">
              Somente documentos gerados
            </option>

            <option value="attached">
              Somente arquivos anexados
            </option>

            <optgroup label="Arquivos anexados">
              {medicalDocumentTypeOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={`medical:${option.value}`}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </optgroup>

            <optgroup label="Documentos gerados">
              {documentTemplateCategoryOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={`generated:${option.value}`}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </optgroup>
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
            Ajuste os filtros, gere um documento ou
            adicione um arquivo pelo prontuário do
            paciente.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map(
            (document) => {
              if (
                document.kind === "generated"
              ) {
                const generated =
                  document.generatedDocument;

                const isDeleting =
                  deletingGeneratedDocumentId ===
                  generated.id;

                return (
                  <article
                    key={`generated-${generated.id}`}
                    className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenGeneratedDocument(
                          generated,
                        )
                      }
                      className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40"
                    >
                      <FileText
                        size={58}
                        className="text-blue-600"
                      />
                    </button>

                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          <FileText size={19} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-semibold">
                            {generated.title}
                          </h2>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {generated.templateName}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                          {getGeneratedDocumentCategoryLabel(
                            generated.category,
                          )}
                        </span>
                      </div>

                      <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <UserRound
                            size={15}
                            className="shrink-0 text-muted-foreground"
                          />

                          <span className="truncate">
                            {generated.patientName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Stethoscope
                            size={15}
                            className="shrink-0 text-muted-foreground"
                          />

                          <span className="truncate">
                            {generated.professional}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(
                            generated.createdAt,
                          )}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-[1fr_auto_auto_auto_auto] gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenGeneratedDocument(
                              generated,
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
                            handleOpenGeneratedDocument(
                              generated,
                            )
                          }
                          title="Imprimir ou salvar como PDF"
                          className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                        >
                          <Printer size={17} />
                        </button>


                        <Link
                          href={`/documentos/gerar?documentId=${generated.id}`}
                          title="Editar documento"
                          className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                        >
                          <Pencil size={17} />
                        </Link>

                        <Link
                          href={`/prontuarios/${generated.patientId}`}
                          title="Abrir prontuário"
                          className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                        >
                          <UserRound size={17} />
                        </Link>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() =>
                            void handleDeleteGeneratedDocument(
                              generated,
                            )
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
                    </div>
                  </article>
                );
              }

              const attached =
                document.medicalDocument;

              const isImage =
                attached.mimeType.startsWith(
                  "image/",
                );

              return (
                <article
                  key={`medical-${attached.id}`}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenMedicalDocument(
                        attached,
                      )
                    }
                    className="flex h-44 w-full items-center justify-center overflow-hidden bg-muted"
                  >
                    {isImage ? (
                      <img
                        src={attached.dataUrl}
                        alt={attached.name}
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
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
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
                          {attached.name}
                        </h2>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {attached.fileName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {getMedicalDocumentTypeLabel(
                          attached.type,
                        )}
                      </span>
                    </div>

                    {attached.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {attached.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <UserRound
                          size={15}
                          className="shrink-0 text-muted-foreground"
                        />

                        <span className="truncate">
                          {attached.patientName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={15}
                          className="shrink-0 text-muted-foreground"
                        />

                        <span className="truncate">
                          {attached.professional}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(
                          attached.size,
                        )}{" "}
                        •{" "}
                        {formatDate(
                          attached.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenMedicalDocument(
                            attached,
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
                          handleDownloadMedicalDocument(
                            attached,
                          )
                        }
                        title="Baixar documento"
                        className="flex items-center justify-center rounded-xl border px-3 transition hover:bg-muted"
                      >
                        <Download size={17} />
                      </button>

                      <Link
                        href={`/prontuarios/${attached.patientId}`}
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