"use client";

import { AlertCircle, HeartPulse, Pill } from "lucide-react";

import { AddHistoryItemDialog } from "@/components/medical-record/add-history-item-dialog";
import type { MedicalHistoryItem } from "@/types/medical-record";

type MedicalHistoryCategory =
  | "allergies"
  | "conditions"
  | "medications";

interface MedicalHistoryProps {
  patientId: string;
  allergies: MedicalHistoryItem[];
  conditions: MedicalHistoryItem[];
  medications: MedicalHistoryItem[];
  onItemCreated: (
    category: MedicalHistoryCategory,
    item: MedicalHistoryItem,
  ) => void;
}

interface HistorySectionProps {
  title: string;
  singularLabel: string;
  patientId: string;
  category: MedicalHistoryCategory;
  items: MedicalHistoryItem[];
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  onCreated: (item: MedicalHistoryItem) => void;
}

function HistorySection({
  title,
  singularLabel,
  patientId,
  category,
  items,
  icon: Icon,
  onCreated,
}: HistorySectionProps) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Icon size={20} />
          </div>

          <h3 className="font-bold">{title}</h3>
        </div>

        <AddHistoryItemDialog
          patientId={patientId}
          category={category}
          label={singularLabel}
          onCreated={onCreated}
        />
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma informação registrada.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-muted p-4"
            >
              <p className="font-semibold">{item.title}</p>

              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export function MedicalHistory({
  patientId,
  allergies,
  conditions,
  medications,
  onItemCreated,
}: MedicalHistoryProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <HistorySection
        title="Alergias"
        singularLabel="Alergia"
        patientId={patientId}
        category="allergies"
        items={allergies}
        icon={AlertCircle}
        onCreated={(item) =>
          onItemCreated("allergies", item)
        }
      />

      <HistorySection
        title="Condições"
        singularLabel="Condição"
        patientId={patientId}
        category="conditions"
        items={conditions}
        icon={HeartPulse}
        onCreated={(item) =>
          onItemCreated("conditions", item)
        }
      />

      <HistorySection
        title="Medicamentos"
        singularLabel="Medicamento"
        patientId={patientId}
        category="medications"
        items={medications}
        icon={Pill}
        onCreated={(item) =>
          onItemCreated("medications", item)
        }
      />
    </section>
  );
}