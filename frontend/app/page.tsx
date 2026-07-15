import {
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  UserRoundPlus,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { MonthlySummary } from "@/components/dashboard/monthly-summary";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const metrics = [
  {
    title: "Consultas hoje",
    value: "12",
    description: "3 ainda aguardando confirmação",
    icon: CalendarCheck,
  },
  {
    title: "Pacientes ativos",
    value: "248",
    description: "18 novos neste mês",
    icon: UserRoundPlus,
  },
  {
    title: "Taxa de ocupação",
    value: "86%",
    description: "6% acima do mês anterior",
    icon: Clock3,
  },
  {
    title: "Receita prevista",
    value: "R$ 18.750",
    description: "Referente ao mês atual",
    icon: CircleDollarSign,
  },
];

const appointments = [
  {
    time: "08:30",
    patient: "Mariana Oliveira",
    procedure: "Avaliação",
    status: "Confirmada" as const,
  },
  {
    time: "10:00",
    patient: "Carlos Henrique",
    procedure: "Limpeza",
    status: "Confirmada" as const,
  },
  {
    time: "13:30",
    patient: "Amanda Souza",
    procedure: "Restauração",
    status: "Pendente" as const,
  },
  {
    time: "15:00",
    patient: "Rafael Martins",
    procedure: "Retorno",
    status: "Confirmada" as const,
  },
];

export default function Home() {
  return (
    <DashboardLayout>
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <RecentAppointments appointments={appointments} />
        <MonthlySummary />
      </section>
    </DashboardLayout>
  );
}