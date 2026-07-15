export function MonthlySummary() {
  return (
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
  );
}