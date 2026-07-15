import {
  CalendarPlus,
  FilePlus2,
  Pill,
  Upload,
} from "lucide-react";

const actions = [
  {
    label: "Nova consulta",
    icon: CalendarPlus,
  },
  {
    label: "Nova receita",
    icon: Pill,
  },
  {
    label: "Novo documento",
    icon: FilePlus2,
  },
  {
    label: "Enviar exame",
    icon: Upload,
  },
];

export function QuickActions() {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="font-bold">Ações rápidas</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition hover:bg-muted"
            >
              <Icon size={18} className="text-blue-600" />
              {action.label}
            </button>
          );
        })}
      </div>
    </article>
  );
}