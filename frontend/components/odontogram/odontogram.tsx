"use client";

import { useState } from "react";

import type {
  Tooth,
  ToothHistoryEntry,
  ToothStatus,
} from "@/types/odontogram";

import { ToothCard } from "./tooth-card";
import { ToothHistory } from "./tooth-history";
import { ToothModal } from "./tooth-modal";

interface OdontogramProps {
  teeth: Tooth[];
  history: ToothHistoryEntry[];
  onToothUpdate?: (tooth: Tooth) => void;
}

export function Odontogram({
  teeth,
  history,
  onToothUpdate,
}: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] =
    useState<Tooth | null>(null);

  const upperTeeth = teeth.filter(
    (tooth) =>
      tooth.number >= 11 && tooth.number <= 28,
  );

  const lowerTeeth = teeth.filter(
    (tooth) =>
      tooth.number >= 31 && tooth.number <= 48,
  );

  function handleToothClick(tooth: Tooth) {
    setSelectedTooth(tooth);
  }

  function handleCloseModal() {
    setSelectedTooth(null);
  }

  function handleSave(
    status: ToothStatus,
    notes: string,
  ) {
    if (!selectedTooth) {
      return;
    }

    const updatedTooth: Tooth = {
      ...selectedTooth,
      status,
      notes: notes || undefined,
    };

    onToothUpdate?.(updatedTooth);
    setSelectedTooth(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold">
            Odontograma
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Selecione um dente para atualizar seu estado
            clínico e adicionar observações.
          </p>
        </div>

        <div className="mt-6 space-y-8">
          <div>
            <p className="mb-3 text-sm font-semibold">
              Arcada superior
            </p>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 xl:grid-cols-16">
              {upperTeeth.map((tooth) => (
                <ToothCard
                  key={tooth.number}
                  tooth={tooth}
                  onClick={handleToothClick}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">
              Arcada inferior
            </p>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 xl:grid-cols-16">
              {lowerTeeth.map((tooth) => (
                <ToothCard
                  key={tooth.number}
                  tooth={tooth}
                  onClick={handleToothClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ToothHistory history={history} />

      <ToothModal
        tooth={selectedTooth}
        open={Boolean(selectedTooth)}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
}