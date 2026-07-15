import { AlertCircle, HeartPulse, Pill } from "lucide-react";

import type { MedicalHistoryItem } from "@/types/medical-record";

interface MedicalHistoryProps {
  allergies: MedicalHistoryItem[];
  conditions: MedicalHistoryItem[];
  medications: MedicalHistoryItem[];
}

function HistorySection({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: MedicalHistoryItem[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Icon size={20} />
        </div>

        <h3 className="font-bold">{title}</h3>
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
    </div>
  );
}

export function MedicalHistory({
  allergies,
  conditions,
  medications,
}: MedicalHistoryProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <HistorySection
        title="Alergias"
        items={allergies}
        icon={AlertCircle}
      />

      <HistorySection
        title="Condições"
        items={conditions}
        icon={HeartPulse}
      />

      <HistorySection
        title="Medicamentos"
        items={medications}
        icon={Pill}
      />
    </section>
  );
}