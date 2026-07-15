import {
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  UserRoundPlus,
} from "lucide-react";
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
    status: "Confirmada",
  },
  {
    time: "10:00",
    patient: "Carlos Henrique",
    procedure: "Limpeza",
    status: "Confirmada",
  },
  {
    time: "13:30",
    patient: "Amanda Souza",
    procedure: "Restauração",
    status: "Pendente",
  },
  {
    time: "15:00",
    patient: "Rafael Martins",
    procedure: "Retorno",
    status: "Confirmada",
  },
];

export default function Home() {
  return (
    <DashboardLayout>
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {metric.value}
                  </h3>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950">
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {metric.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Agenda de hoje</h3>
              <p className="text-sm text-muted-foreground">
                Próximos atendimentos do consultório
              </p>
            </div>

            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Nova consulta
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="pb-3 font-semibold">Horário</th>
                  <th className="pb-3 font-semibold">Paciente</th>
                  <th className="pb-3 font-semibold">Procedimento</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={`${appointment.time}-${appointment.patient}`}
                    className="border-b last:border-0"
                  >
                    <td className="py-4 font-semibold">{appointment.time}</td>
                    <td className="py-4">{appointment.patient}</td>
                    <td className="py-4 text-muted-foreground">
                      {appointment.procedure}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          appointment.status === "Confirmada"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

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