"use client";

import {
  CalendarDays,
  ClipboardPlus,
  Plus,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { addClinicalEvolution } from "@/services/medical-record.service";
import type { ClinicalEvolution } from "@/types/medical-record";

interface ClinicalEvolutionProps {
  patientId: string;
  evolutions: ClinicalEvolution[];
  onCreated: (evolution: ClinicalEvolution) => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function ClinicalEvolution({
  patientId,
  evolutions,
  onCreated,
}: ClinicalEvolutionProps) {
  const [procedure, setProcedure] = useState("");
  const [description, setDescription] = useState("");
  const [returnRecommendation, setReturnRecommendation] =
    useState("");
  const [isSaving, setIsSaving] = useState(false);

  function clearForm() {
    setProcedure("");
    setDescription("");
    setReturnRecommendation("");
  }

  async function handleCreate() {
    if (procedure.trim().length < 2) {
      toast.error("Informe o procedimento realizado.");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Informe uma descrição clínica mais detalhada.");
      return;
    }

    try {
      setIsSaving(true);

      const evolution = await addClinicalEvolution(patientId, {
        date: new Date().toISOString().slice(0, 10),
        professional: "Dr. Victor Valadares",
        procedure: procedure.trim(),
        description: description.trim(),
        returnRecommendation:
          returnRecommendation.trim() || undefined,
      });

      onCreated(evolution);
      clearForm();

      toast.success("Evolução clínica registrada com sucesso.");
    } catch {
      toast.error("Não foi possível registrar a evolução clínica.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Stethoscope size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold">Evolução clínica</h2>

          <p className="text-sm text-muted-foreground">
            Registre procedimentos, observações e recomendações de
            retorno.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5 rounded-2xl border bg-background p-5">
        <div className="space-y-2">
          <label
            htmlFor="procedure"
            className="text-sm font-semibold"
          >
            Procedimento realizado
          </label>

          <input
            id="procedure"
            type="text"
            value={procedure}
            onChange={(event) => setProcedure(event.target.value)}
            placeholder="Ex.: Limpeza, restauração ou avaliação"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold"
          >
            Descrição clínica
          </label>

          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva o atendimento, sintomas, procedimentos e orientações fornecidas..."
            className="w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="returnRecommendation"
            className="text-sm font-semibold"
          >
            Retorno recomendado
          </label>

          <input
            id="returnRecommendation"
            type="text"
            value={returnRecommendation}
            onChange={(event) =>
              setReturnRecommendation(event.target.value)
            }
            placeholder="Ex.: Retorno em 30 dias"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Responsável:{" "}
            <strong className="text-foreground">
              Dr. Victor Valadares
            </strong>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearForm}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Limpar
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={16} />
              {isSaving ? "Salvando..." : "Salvar evolução"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {evolutions.length === 0 ? (
          <div className="rounded-xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma evolução clínica registrada.
            </p>
          </div>
        ) : (
          evolutions.map((evolution) => (
            <div
              key={evolution.id}
              className="rounded-2xl border p-5"
            >
              <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-muted p-2">
                    <ClipboardPlus size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {evolution.procedure ||
                        "Evolução clínica"}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {evolution.professional}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  {formatDate(evolution.date)}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {evolution.description}
              </p>

              {evolution.returnRecommendation && (
                <div className="mt-4 rounded-xl bg-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Retorno recomendado
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {evolution.returnRecommendation}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
}