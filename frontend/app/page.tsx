import {
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  UserRoundPlus,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
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

        <article className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold">Resumo mensal</h3>

          <p className="text-sm text-muted-foreground">
            Indicadores do consultório
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Consultas realizadas</span>
                <strong>82%</strong>
              </div>

              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[82%] rounded-full bg-blue-600" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Consultas confirmadas</span>
                <strong>74%</strong>
              </div>

              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[74%] rounded-full bg-green-600" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Pagamentos recebidos</span>
                <strong>68%</strong>
              </div>

              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[68%] rounded-full bg-violet-600" />
              </div>
            </div>
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}