"use client";

import { useState } from "react";

import { ToothCard } from "./tooth-card";
import { ToothModal } from "./tooth-modal";

import type {
  Tooth,
  ToothStatus,
} from "@/types/odontogram";

interface OdontogramProps {
  teeth: Tooth[];
  onToothUpdate?: (tooth: Tooth) => void;
}

export function Odontogram({
  teeth,
  onToothUpdate,
}: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] =
    useState<Tooth | null>(null);

  const upperTeeth = teeth.slice(0, 16);
  const lowerTeeth = teeth.slice(16);

  function handleSave(
    status: ToothStatus,
    notes: string,
  ) {
    if (!selectedTooth) {
      return;
    }

    onToothUpdate?.({
      ...selectedTooth,
      status,
      notes,
      updatedAt: new Date().toISOString(),
    });

    setSelectedTooth(null);
  }

  return (
    <>
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Odontograma
          </h2>

          <p className="text-sm text-muted-foreground">
            Clique em um dente para alterar seu estado.
          </p>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Arcada Superior
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {upperTeeth.map((tooth) => (
                <ToothCard
                  key={tooth.number}
                  tooth={tooth}
                  onClick={setSelectedTooth}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Arcada Inferior
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {lowerTeeth.map((tooth) => (
                <ToothCard
                  key={tooth.number}
                  tooth={tooth}
                  onClick={setSelectedTooth}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ToothModal
        tooth={selectedTooth}
        open={selectedTooth !== null}
        onClose={() => setSelectedTooth(null)}
        onSave={handleSave}
      />
    </>
  );
}