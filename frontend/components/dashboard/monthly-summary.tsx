import {
  CircleAlert,
  FileText,
} from "lucide-react";

interface MonthlySummaryProps {
  completedRate: number;
  confirmedRate: number;
  paymentRate: number;
  pendingTransactions: number;
  overdueTransactions: number;
  totalDocuments: number;
  documentsCreatedThisMonth: number;
  isLoading?: boolean;
}

interface ProgressIndicatorProps {
  label: string;
  value: number;
  progressClassName: string;
}

function ProgressIndicator({
  label,
  value,
  progressClassName,
}: ProgressIndicatorProps) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${progressClassName}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, value),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

export function MonthlySummary({
  completedRate,
  confirmedRate,
  paymentRate,
  pendingTransactions,
  overdueTransactions,
  totalDocuments,
  documentsCreatedThisMonth,
  isLoading = false,
}: MonthlySummaryProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-bold">
        Resumo mensal
      </h3>

      <p className="text-sm text-muted-foreground">
        Indicadores calculados com os dados do sistema
      </p>

      {isLoading ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Carregando indicadores...
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-5">
            <ProgressIndicator
              label="Consultas realizadas"
              value={completedRate}
              progressClassName="bg-blue-600"
            />

            <ProgressIndicator
              label="Consultas confirmadas"
              value={confirmedRate}
              progressClassName="bg-green-600"
            />

            <ProgressIndicator
              label="Pagamentos recebidos"
              value={paymentRate}
              progressClassName="bg-violet-600"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <CircleAlert size={17} />

                <p className="text-xs font-semibold">
                  Financeiro
                </p>
              </div>

              <p className="mt-2 text-sm">
                <strong>{pendingTransactions}</strong>{" "}
                pendentes
              </p>

              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                <strong>{overdueTransactions}</strong>{" "}
                vencidos
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/40">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <FileText size={17} />

                <p className="text-xs font-semibold">
                  Documentos
                </p>
              </div>

              <p className="mt-2 text-sm">
                <strong>{totalDocuments}</strong>{" "}
                cadastrados
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {documentsCreatedThisMonth} adicionados
                neste mês
              </p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}