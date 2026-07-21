"use client";

import { UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

import type {
  CreateMedicalDocumentInput,
  MedicalDocumentType,
} from "@/types/medical-document";
import { medicalDocumentTypeOptions } from "@/types/medical-document";

interface MedicalDocumentFormProps {
  patientId: string;
  onSave: (
    input: CreateMedicalDocumentInput,
  ) => Promise<void>;
}

export function MedicalDocumentForm({
  patientId,
  onSave,
}: MedicalDocumentFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [type, setType] =
    useState<MedicalDocumentType>("radiography");
  const [professional, setProfessional] =
    useState("Dr. Victor Valadares");
  const [file, setFile] = useState<File | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Informe o nome do documento.");
      return;
    }

    if (!professional.trim()) {
      setError("Informe o profissional responsável.");
      return;
    }

    if (!file) {
      setError("Selecione um arquivo.");
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        patientId,
        name,
        description,
        type,
        file,
        professional,
      });

      setName("");
      setDescription("");
      setType("radiography");
      setFile(null);

      const fileInput =
        document.querySelector<HTMLInputElement>(
          "#medical-document-file",
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível enviar o documento.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          Adicionar documento
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Envie radiografias, exames, laudos ou
          documentos clínicos.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="medical-document-name"
              className="mb-2 block text-sm font-medium"
            >
              Nome do documento
            </label>

            <input
              id="medical-document-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ex.: Radiografia panorâmica"
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="medical-document-type"
              className="mb-2 block text-sm font-medium"
            >
              Tipo
            </label>

            <select
              id="medical-document-type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target
                    .value as MedicalDocumentType,
                )
              }
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            >
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="medical-document-professional"
              className="mb-2 block text-sm font-medium"
            >
              Profissional responsável
            </label>

            <input
              id="medical-document-professional"
              value={professional}
              onChange={(event) =>
                setProfessional(event.target.value)
              }
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="medical-document-file"
              className="mb-2 block text-sm font-medium"
            >
              Arquivo
            </label>

            <input
              id="medical-document-file"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={(event) =>
                setFile(
                  event.target.files?.[0] ?? null,
                )
              }
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WEBP ou PDF com até 2 MB.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="medical-document-description"
            className="mb-2 block text-sm font-medium"
          >
            Descrição
          </label>

          <textarea
            id="medical-document-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Adicione informações relevantes sobre o documento."
            rows={4}
            className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          <UploadCloud size={18} />

          {isSaving
            ? "Enviando..."
            : "Adicionar documento"}
        </button>
      </form>
    </section>
  );
}