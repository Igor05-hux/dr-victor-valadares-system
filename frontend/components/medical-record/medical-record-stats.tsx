import {
  CalendarDays,
  ClipboardList,
  FileText,
  Stethoscope,
} from "lucide-react";

interface MedicalRecordStatsProps {
  historyCount: number;
  evolutionsCount: number;
  prescriptionsCount: number;
  consultationsCount: number;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
          <Icon
            size={21}
            className="text-foreground"
          />
        </div>
      </div>
    </article>
  );
}

export function MedicalRecordStats({
  historyCount,
  evolutionsCount,
  prescriptionsCount,
  consultationsCount,
}: MedicalRecordStatsProps) {
  const stats = [
    {
      title: "Histórico médico",
      value: historyCount,
      description:
        historyCount === 1
          ? "registro clínico"
          : "registros clínicos",
      icon: ClipboardList,
    },
    {
      title: "Evoluções",
      value: evolutionsCount,
      description:
        evolutionsCount === 1
          ? "evolução registrada"
          : "evoluções registradas",
      icon: Stethoscope,
    },
    {
      title: "Receitas",
      value: prescriptionsCount,
      description:
        prescriptionsCount === 1
          ? "receita emitida"
          : "receitas emitidas",
      icon: FileText,
    },
    {
      title: "Consultas",
      value: consultationsCount,
      description:
        consultationsCount === 1
          ? "consulta registrada"
          : "consultas registradas",
      icon: CalendarDays,
    },
  ];

  return (
    <section
      aria-label="Indicadores do prontuário"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}