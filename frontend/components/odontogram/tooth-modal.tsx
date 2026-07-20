"use client";

import { useEffect, useState } from "react";

import type {
  Tooth,
  ToothStatus,
} from "@/types/odontogram";

interface ToothModalProps {
  tooth: Tooth | null;
  open: boolean;
  onClose: () => void;
  onSave: (
    status: ToothStatus,
    notes: string,
  ) => void;
}

const statusOptions: Array<{
  value: ToothStatus;
  label: string;
  description: string;
}> = [
  {
    value: "healthy",
    label: "Saudável",
    description: "Sem alterações clínicas registradas.",
  },
  {
    value: "caries",
    label: "Cárie",
    description: "Dente com presença de lesão cariosa.",
  },
  {
    value: "restoration",
    label: "Restauração",
    description: "Dente restaurado ou com restauração indicada.",
  },
  {
    value: "root-canal",
    label: "Tratamento de canal",
    description: "Tratamento endodôntico realizado ou indicado.",
  },
  {
    value: "implant",
    label: "Implante",
    description: "Elemento substituído por implante dentário.",
  },
  {
    value: "extracted",
    label: "Extraído",
    description: "Dente ausente por extração.",
  },
];

export function ToothModal({
  tooth,
  open,
  onClose,
  onSave,
}: ToothModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ToothStatus>("healthy");

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!tooth) {
      return;
    }

    setSelectedStatus(tooth.status);
    setNotes(tooth.notes ?? "");
  }, [tooth]);

  function handleSave() {
    onSave(selectedStatus, notes.trim());
  }

  function handleOverlayClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!open || !tooth) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tooth-modal-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl"
      >
        <div>
          <h2
            id="tooth-modal-title"
            className="text-xl font-bold"
          >
            Dente {tooth.number}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {tooth.name}
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold">
            Estado clínico
          </p>

          <div className="space-y-3">
            {statusOptions.map((option) => {
              const isSelected =
                selectedStatus === option.value;

              return (
                <label
                  key={option.value}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-muted",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="tooth-status"
                    value={option.value}
                    checked={isSelected}
                    onChange={() =>
                      setSelectedStatus(option.value)
                    }
                    className="mt-1"
                  />

                  <span>
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="tooth-notes"
            className="text-sm font-semibold"
          >
            Observações
          </label>

          <textarea
            id="tooth-notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            maxLength={500}
            placeholder="Ex.: Paciente relata sensibilidade ao frio."
            className="mt-2 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />

          <div className="mt-1 text-right text-xs text-muted-foreground">
            {notes.length}/500
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}