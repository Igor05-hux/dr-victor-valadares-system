"use client";

import {
  ArrowLeft,
  Eye,
  FileDown,
  FileText,
  Save,
  UserRound,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createGeneratedDocument } from "@/services/generated-document.service";
import { openDocumentForPrint } from "@/services/document-print.service";
import { getDocumentTemplates } from "@/services/document-template.service";
import { getPatients } from "@/services/patient.service";
import {
  extractTemplateVariables,
  renderDocumentTemplate,
} from "@/services/template-renderer.service";
import {
  documentTemplateCategoryOptions,
  type DocumentTemplate,
} from "@/types/document-template";
import type { Patient } from "@/types/patient";

interface AdditionalFields {
  attendanceDate: string;
  startTime: string;
  endTime: string;
  restDays: string;

  treatmentDescription: string;
  treatmentTeeth: string;
  treatmentItems: string;
  treatmentTotal: string;

  paymentMethod: string;
  paymentDownPayment: string;
  paymentInstallments: string;
  paymentInstallmentValue: string;
  paymentDueDate: string;
  paymentNotes: string;

  recipientName: string;
  recipientCpf: string;
}

const initialAdditionalFields: AdditionalFields = {
  attendanceDate: "",
  startTime: "",
  endTime: "",
  restDays: "1",

  treatmentDescription: "",
  treatmentTeeth: "",
  treatmentItems: "",
  treatmentTotal: "",

  paymentMethod: "",
  paymentDownPayment: "",
  paymentInstallments: "",
  paymentInstallmentValue: "",
  paymentDueDate: "",
  paymentNotes: "",

  recipientName: "",
  recipientCpf: "",
};

function getTodayValue(): string {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    currentDate.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(
  dateValue: string,
): string {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(
    `${dateValue}T12:00:00`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    parsedDate,
  );
}

function formatFullDate(
  dateValue: string,
): string {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(
    `${dateValue}T12:00:00`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(parsedDate);
}

function getCategoryLabel(
  template: DocumentTemplate,
): string {
  return (
    documentTemplateCategoryOptions.find(
      (option) =>
        option.value === template.category,
    )?.label ?? "Outro documento"
  );
}

export default function GenerateDocumentPage() {
  const [patients, setPatients] = useState<
    Patient[]
  >([]);

  const [templates, setTemplates] = useState<
    DocumentTemplate[]
  >([]);

  const [patientId, setPatientId] =
    useState("");

  const [templateId, setTemplateId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [generatedContent, setGeneratedContent] =
    useState("");

  const [additionalFields, setAdditionalFields] =
    useState<AdditionalFields>({
      ...initialAdditionalFields,
      attendanceDate: getTodayValue(),
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    async function loadPageData(): Promise<void> {
      try {
        setIsLoading(true);

        const [
          loadedPatients,
          loadedTemplates,
        ] = await Promise.all([
          getPatients(),
          getDocumentTemplates(),
        ]);

        setPatients(loadedPatients);

        setTemplates(
          loadedTemplates.filter(
            (template) => template.isActive,
          ),
        );
      } catch (error) {
        toast.error(
          "Não foi possível carregar o gerador.",
          {
            description:
              error instanceof Error
                ? error.message
                : undefined,
          },
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPageData();
  }, []);

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) => patient.id === patientId,
      ) ?? null,
    [patientId, patients],
  );

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (template) =>
          template.id === templateId,
      ) ?? null,
    [templateId, templates],
  );

  const templateVariables = useMemo(() => {
  if (!selectedTemplate) {
    return [];
  }

  return extractTemplateVariables(
    selectedTemplate.content,
  );
}, [selectedTemplate]);

function usesVariablePrefix(
  prefix: string,
): boolean {
  return templateVariables.some(
    (variable) =>
      variable === prefix ||
      variable.startsWith(`${prefix}.`),
  );
}

const usesAttendanceFields =
  templateVariables.some((variable) =>
    [
      "document.attendanceDate",
      "document.fullDate",
      "document.startTime",
      "document.endTime",
      "document.restDays",
    ].includes(variable),
  );

const usesTreatmentFields =
  usesVariablePrefix("treatment");

const usesPaymentFields =
  usesVariablePrefix("payment");

const usesRecipientFields =
  usesVariablePrefix("recipient");

const usesGuardianFields =
  usesVariablePrefix("guardian");

  function updateAdditionalField<
    Key extends keyof AdditionalFields,
  >(
    field: Key,
    value: AdditionalFields[Key],
  ): void {
    setAdditionalFields(
      (currentFields) => ({
        ...currentFields,
        [field]: value,
      }),
    );
  }

  function handlePatientChange(
  newPatientId: string,
): void {
  setPatientId(newPatientId);
  setGeneratedContent("");

  const patient = patients.find(
    (item) => item.id === newPatientId,
  );

  setAdditionalFields(
    (currentFields) => ({
      ...currentFields,
      recipientName: patient?.name ?? "",
      recipientCpf: patient?.cpf ?? "",
    }),
  );
}
  function handleTemplateChange(
  newTemplateId: string,
): void {
  setTemplateId(newTemplateId);
  setGeneratedContent("");

  const template = templates.find(
    (item) => item.id === newTemplateId,
  );

  setTitle(template?.name ?? "");
}

  function generatePreview(): void {
    if (!selectedPatient) {
      toast.error("Selecione um paciente.");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Selecione um modelo.");
      return;
    }

    const renderedContent =
      renderDocumentTemplate(
        selectedTemplate.content,
        {
          patient: selectedPatient,

          professional: {
            name: "Dr. Victor Valadares",
            cro: "74639",
          },

          clinic: {
            name:
              "Clínica Dr. Victor Valadares",
            cnpj: "",
            city: "Pará de Minas",
            state: "MG",
          },

          guardian: {
            name:
              selectedPatient.guardianName,
            cpf:
              selectedPatient.guardianCpf,
            rg:
              selectedPatient.guardianRg,
          },

          document: {
            attendanceDate: formatDate(
              additionalFields.attendanceDate,
            ),
            fullDate: formatFullDate(
              additionalFields.attendanceDate,
            ),
            startTime:
              additionalFields.startTime,
            endTime:
              additionalFields.endTime,
            restDays:
              additionalFields.restDays,
          },

          treatment: {
            description:
              additionalFields.treatmentDescription,
            teeth:
              additionalFields.treatmentTeeth,
            items:
              additionalFields.treatmentItems,
            total:
              additionalFields.treatmentTotal,
          },

          payment: {
            method:
              additionalFields.paymentMethod,
            downPayment:
              additionalFields.paymentDownPayment,
            installments:
              additionalFields.paymentInstallments,
            installmentValue:
              additionalFields.paymentInstallmentValue,
            dueDate: formatDate(
              additionalFields.paymentDueDate,
            ),
            notes:
              additionalFields.paymentNotes,
          },

          recipient: {
            name:
              additionalFields.recipientName,
            cpf:
              additionalFields.recipientCpf,
          },
        },
      );

    setGeneratedContent(renderedContent);

    toast.success(
      "Prévia gerada com sucesso.",
    );
  }

  function handlePrintDocument(): void {
    if (!selectedPatient) {
      toast.error("Selecione um paciente.");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Selecione um modelo.");
      return;
    }

    if (!generatedContent.trim()) {
      toast.error(
        "Gere a prévia antes de abrir o documento.",
      );
      return;
    }

    try {
      openDocumentForPrint({
        title:
          title.trim() ||
          selectedTemplate.name,
        content: generatedContent,
        patientName: selectedPatient.name,
        professionalName:
          "Dr. Victor Valadares",
        professionalCro: "74639",
        clinicName:
          "Clínica Dr. Victor Valadares",
        clinicCity: "Pará de Minas",
        clinicState: "MG",
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

  async function handleSave(): Promise<void> {
    if (!selectedPatient) {
      toast.error("Selecione um paciente.");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Selecione um modelo.");
      return;
    }

    if (!generatedContent.trim()) {
      toast.error(
        "Gere ou escreva o conteúdo do documento.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await createGeneratedDocument({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        templateId:
          selectedTemplate.id,
        templateName:
          selectedTemplate.name,
        category:
          selectedTemplate.category,
        title:
          title.trim() ||
          selectedTemplate.name,
        content: generatedContent,
        professional:
          "Dr. Victor Valadares",
      });

      toast.success(
        "Documento salvo com sucesso.",
        {
          description: selectedPatient.name,
        },
      );
    } catch (error) {
      toast.error(
        "Não foi possível salvar o documento.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-20 animate-pulse rounded-2xl bg-muted" />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-[680px] animate-pulse rounded-2xl bg-muted" />
            <div className="h-[680px] animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Gerar documento
            </h1>

            <p className="text-sm text-muted-foreground">
              Selecione um paciente e um modelo para
              criar um documento personalizado.
            </p>
          </div>

          <Link
            href="/documentos"
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <ArrowLeft size={18} />
            Voltar para documentos
          </Link>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <WandSparkles size={21} />
              </div>

              <div>
                <h2 className="font-bold">
                  Configuração
                </h2>

                <p className="text-sm text-muted-foreground">
                  Preencha os dados usados no documento.
                </p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Paciente
              </span>

              <select
                value={patientId}
                onChange={(event) =>
                  handlePatientChange(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="">
                  Selecione um paciente
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedPatient && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <UserRound
                    size={17}
                    className="text-muted-foreground"
                  />

                  <strong className="text-sm">
                    {selectedPatient.name}
                  </strong>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  CPF:{" "}
                  {selectedPatient.cpf ||
                    "Não informado"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  RG:{" "}
                  {selectedPatient.rg ||
                    "Não informado"}
                </p>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Modelo
              </span>

              <select
                value={templateId}
                onChange={(event) =>
                  handleTemplateChange(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="">
                  Selecione um modelo
                </option>

                {templates.map((template) => (
                  <option
                    key={template.id}
                    value={template.id}
                  >
                    {template.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedTemplate && (
              <div className="rounded-xl border p-4">
    <p className="text-xs font-semibold text-blue-600">
      {getCategoryLabel(selectedTemplate)}
    </p>

    <p className="mt-2 text-sm text-muted-foreground">
      {selectedTemplate.description}
    </p>

    {templateVariables.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {templateVariables.map((variable) => (
          <span
            key={variable}
            className="rounded-lg bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {`{{${variable}}}`}
          </span>
        ))}
      </div>
    )}
  </div>
            )}

            {selectedPatient &&
  usesGuardianFields &&
  !selectedPatient.guardianName && (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
      Este documento utiliza dados do responsável,
      mas o paciente não possui responsável cadastrado.
      Atualize o cadastro antes de gerar o documento.
    </div>
  )}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Título final
              </span>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Título do documento"
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
              />
            </label>

            {usesAttendanceFields && (
              <div className="border-t pt-5">
                <h3 className="font-semibold">
                  Dados do atendimento
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(templateVariables.includes(
                    "document.attendanceDate",
                  ) ||
                    templateVariables.includes(
                      "document.fullDate",
                    )) && (
                    <label>
                      <span className="mb-2 block text-sm">
                        Data
                      </span>

                      <input
                        type="date"
                        value={
                          additionalFields.attendanceDate
                        }
                        onChange={(event) =>
                          updateAdditionalField(
                            "attendanceDate",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "document.restDays",
                  ) && (
                    <label>
                      <span className="mb-2 block text-sm">
                        Dias de repouso
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={additionalFields.restDays}
                        onChange={(event) =>
                          updateAdditionalField(
                            "restDays",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "document.startTime",
                  ) && (
                    <label>
                      <span className="mb-2 block text-sm">
                        Horário inicial
                      </span>

                      <input
                        type="time"
                        value={additionalFields.startTime}
                        onChange={(event) =>
                          updateAdditionalField(
                            "startTime",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "document.endTime",
                  ) && (
                    <label>
                      <span className="mb-2 block text-sm">
                        Horário final
                      </span>

                      <input
                        type="time"
                        value={additionalFields.endTime}
                        onChange={(event) =>
                          updateAdditionalField(
                            "endTime",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {usesTreatmentFields && (
              <div className="border-t pt-5">
                <h3 className="font-semibold">
                  Tratamento
                </h3>

                <div className="mt-4 space-y-4">
                  {templateVariables.includes(
                    "treatment.description",
                  ) && (
                    <label className="block">
                      <span className="mb-2 block text-sm">
                        Descrição do procedimento
                      </span>

                      <textarea
                        rows={3}
                        value={
                          additionalFields.treatmentDescription
                        }
                        onChange={(event) =>
                          updateAdditionalField(
                            "treatmentDescription",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-xl border bg-background px-3 py-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "treatment.teeth",
                  ) && (
                    <label className="block">
                      <span className="mb-2 block text-sm">
                        Dentes ou regiões
                      </span>

                      <input
                        value={additionalFields.treatmentTeeth}
                        onChange={(event) =>
                          updateAdditionalField(
                            "treatmentTeeth",
                            event.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "treatment.items",
                  ) && (
                    <label className="block">
                      <span className="mb-2 block text-sm">
                        Itens do tratamento
                      </span>

                      <textarea
                        rows={4}
                        value={additionalFields.treatmentItems}
                        onChange={(event) =>
                          updateAdditionalField(
                            "treatmentItems",
                            event.target.value,
                          )
                        }
                        placeholder="Ex.: Implante — Região 16 — R$ 2.500,00"
                        className="w-full rounded-xl border bg-background px-3 py-3 text-sm"
                      />
                    </label>
                  )}

                  {templateVariables.includes(
                    "treatment.total",
                  ) && (
                    <label className="block">
                      <span className="mb-2 block text-sm">
                        Valor total
                      </span>

                      <input
                        value={additionalFields.treatmentTotal}
                        onChange={(event) =>
                          updateAdditionalField(
                            "treatmentTotal",
                            event.target.value,
                          )
                        }
                        placeholder="R$ 0,00"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {usesPaymentFields && (
              <div className="border-t pt-5">
                <h3 className="font-semibold">
                  Pagamento
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm">
                      Forma
                    </span>

                    <input
                      value={additionalFields.paymentMethod}
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentMethod",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm">
                      Entrada
                    </span>

                    <input
                      value={
                        additionalFields.paymentDownPayment
                      }
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentDownPayment",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm">
                      Parcelas
                    </span>

                    <input
                      value={
                        additionalFields.paymentInstallments
                      }
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentInstallments",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm">
                      Valor da parcela
                    </span>

                    <input
                      value={
                        additionalFields.paymentInstallmentValue
                      }
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentInstallmentValue",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm">
                      Vencimento
                    </span>

                    <input
                      type="date"
                      value={additionalFields.paymentDueDate}
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentDueDate",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm">
                      Observações
                    </span>

                    <textarea
                      rows={3}
                      value={additionalFields.paymentNotes}
                      onChange={(event) =>
                        updateAdditionalField(
                          "paymentNotes",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border bg-background px-3 py-3 text-sm"
                    />
                  </label>
                </div>
              </div>
            )}

            {usesRecipientFields && (
              <div className="border-t pt-5">
                <h3 className="font-semibold">
                  Destinatário
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm">
                      Nome
                    </span>

                    <input
                      value={additionalFields.recipientName}
                      onChange={(event) =>
                        updateAdditionalField(
                          "recipientName",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm">
                      CPF
                    </span>

                    <input
                      value={additionalFields.recipientCpf}
                      onChange={(event) =>
                        updateAdditionalField(
                          "recipientCpf",
                          event.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    />
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={generatePreview}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <WandSparkles size={18} />
              Gerar prévia
            </button>
          </section>

          <section className="flex min-h-[760px] flex-col rounded-2xl border bg-card shadow-sm">
            <header className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">
                  Prévia editável
                </h2>

                <p className="text-sm text-muted-foreground">
                  Revise e altere o conteúdo antes de salvar.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePrintDocument}
                  disabled={!generatedContent.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Eye size={17} />
                  Visualizar
                </button>

                <button
                  type="button"
                  onClick={handlePrintDocument}
                  disabled={!generatedContent.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileDown size={17} />
                  PDF / Imprimir
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleSave()
                  }
                  disabled={
                    isSaving ||
                    !generatedContent.trim()
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {isSaving
                    ? "Salvando..."
                    : "Salvar"}
                </button>
              </div>
            </header>

            {generatedContent ? (
              <textarea
                value={generatedContent}
                onChange={(event) =>
                  setGeneratedContent(
                    event.target.value,
                  )
                }
                className="min-h-[700px] flex-1 resize-none bg-background p-7 font-serif text-sm leading-7 outline-none"
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <FileText
                    size={26}
                    className="text-muted-foreground"
                  />
                </div>

                <h3 className="mt-4 font-semibold">
                  Nenhuma prévia gerada
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Selecione um paciente, escolha um
                  modelo e clique em “Gerar prévia”.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
}