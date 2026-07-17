"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { PrescriptionItem } from "@/types/medical-record";

interface PrescriptionFormProps {
  onSave: (
    items: PrescriptionItem[],
    observations: string,
  ) => void;
}

export function PrescriptionForm({
  onSave,
}: PrescriptionFormProps) {
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] =
    useState("");
  const [duration, setDuration] = useState("");
  const [observations, setObservations] =
    useState("");

  const [items, setItems] = useState<
    PrescriptionItem[]
  >([]);

  function clearFields() {
    setMedication("");
    setDosage("");
    setInstructions("");
    setDuration("");
  }

  function addItem() {
    if (medication.trim().length < 2) {
      toast.error("Informe o medicamento.");
      return;
    }

    const newItem: PrescriptionItem = {
      id: crypto.randomUUID(),
      medication: medication.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      duration: duration.trim(),
    };

    setItems((current) => [...current, newItem]);

    clearFields();
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  function savePrescription() {
    if (items.length === 0) {
      toast.error(
        "Adicione pelo menos um medicamento.",
      );
      return;
    }

    onSave(items, observations);

    setItems([]);
    setObservations("");
  }

  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold">
        Nova Receita
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Medicamento
          </label>

          <input
            value={medication}
            onChange={(e) =>
              setMedication(e.target.value)
            }
            className="h-11 w-full rounded-xl border px-3"
            placeholder="Ex.: Amoxicilina"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Dosagem
          </label>

          <input
            value={dosage}
            onChange={(e) =>
              setDosage(e.target.value)
            }
            className="h-11 w-full rounded-xl border px-3"
            placeholder="500 mg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Modo de uso
          </label>

          <input
            value={instructions}
            onChange={(e) =>
              setInstructions(e.target.value)
            }
            className="h-11 w-full rounded-xl border px-3"
            placeholder="1 comprimido de 8 em 8 horas"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Duração
          </label>

          <input
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            className="h-11 w-full rounded-xl border px-3"
            placeholder="7 dias"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-muted"
        >
          <Plus size={16} />
          Adicionar medicamento
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border p-4"
            >
              <div>
                <strong>{item.medication}</strong>

                <p className="text-sm text-muted-foreground">
                  {item.dosage}
                </p>

                <p className="text-sm">
                  {item.instructions}
                </p>

                {item.duration && (
                  <p className="text-sm">
                    Duração: {item.duration}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <label className="text-sm font-semibold">
          Observações
        </label>

        <textarea
          rows={4}
          value={observations}
          onChange={(e) =>
            setObservations(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          placeholder="Observações adicionais..."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={savePrescription}
          className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Salvar Receita
        </button>
      </div>
    </article>
  );
}