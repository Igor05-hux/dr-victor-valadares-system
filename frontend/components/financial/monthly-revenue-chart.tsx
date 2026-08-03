"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyRevenueChartItem {
  month: string;
  received: number;
  pending: number;
  overdue: number;
}

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueChartItem[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function MonthlyRevenueChart({
  data,
}: MonthlyRevenueChartProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div>
        <h2 className="font-bold">
          Receita dos últimos meses
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Comparativo entre valores recebidos, pendentes e vencidos.
        </p>
      </div>

      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 5,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />

            <YAxis
              tickFormatter={(value: number) =>
                formatCurrency(value)
              }
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={75}
            />

           <Tooltip
  formatter={(value, name) => {
    const numericValue = Array.isArray(value)
      ? Number(value[0] ?? 0)
      : Number(value ?? 0);

    const normalizedName = String(
      name ?? "",
    );

    const labels: Record<string, string> = {
      received: "Recebido",
      pending: "Pendente",
      overdue: "Vencido",
    };

    return [
      formatCurrency(numericValue),
      labels[normalizedName] ??
        normalizedName,
    ];
  }}
/>

            <Bar
              dataKey="received"
              name="received"
              fill="currentColor"
              className="text-emerald-500"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="pending"
              name="pending"
              fill="currentColor"
              className="text-amber-500"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="overdue"
              name="overdue"
              fill="currentColor"
              className="text-red-500"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" />
          Recebido
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-amber-500" />
          Pendente
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-500" />
          Vencido
        </span>
      </div>
    </section>
  );
}