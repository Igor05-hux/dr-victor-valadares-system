"use client";

import {
  ClipboardList,
  FileText,
  History,
  Stethoscope,
} from "lucide-react";

export type MedicalRecordTab =
  | "summary"
  | "evolutions"
  | "prescriptions"
  | "consultations";

interface MedicalRecordTabsProps {
  activeTab: MedicalRecordTab;
  onTabChange: (tab: MedicalRecordTab) => void;
}

const tabs: Array<{
  id: MedicalRecordTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  {
    id: "summary",
    label: "Resumo clínico",
    icon: ClipboardList,
  },
  {
    id: "evolutions",
    label: "Evoluções",
    icon: Stethoscope,
  },
  {
    id: "prescriptions",
    label: "Receitas",
    icon: FileText,
  },
  {
    id: "consultations",
    label: "Consultas",
    icon: History,
  },
];

export function MedicalRecordTabs({
  activeTab,
  onTabChange,
}: MedicalRecordTabsProps) {
  return (
    <nav className="overflow-x-auto rounded-2xl border bg-card p-2 shadow-sm">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={[
                "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon size={17} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}