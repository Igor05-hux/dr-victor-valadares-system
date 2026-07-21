"use client";

import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  createFinancialTransaction,
  deleteFinancialTransaction,
  getFinancialTransactions,
  updateFinancialTransactionStatus,
} from "@/services/financial.service";
import { getPatients } from "@/services/patient.service";
import type {
  CreateFinancialTransactionInput,
  FinancialTransaction,
  FinancialTransactionStatus,
  PaymentMethod,
} from "@/types/financial";
import type { Patient } from "@/types/patient";

type StatusFilter =
  | "Todos"
  | FinancialTransactionStatus;

const statusOptions: FinancialTransactionStatus[] = [
  "Pendente",
  "Pago",
  "Vencido",
  "Cancelado",
];

const paymentMethodOptions: PaymentMethod[] = [
  "PIX",
  "Cartão de crédito",
  "Cartão de débito",
  "Dinheiro",
  "Convênio",
  "Não definido",
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date?: string): string {
  if (!date) {
    return "Não informado";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    parsedDate,
  );
}

function getStatusStyles(
  status: FinancialTransactionStatus,
): string {
  const styles: Record<
    FinancialTransactionStatus,
    string
  > = {
    Pago:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    Pendente:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    Vencido:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    Cancelado:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  };

  return styles[status];
}

function getPaymentMethodIcon(
  paymentMethod: PaymentMethod,
) {
  if (
    paymentMethod === "Cartão de crédito" ||
    paymentMethod === "Cartão de débito"
  ) {
    return CreditCard;
  }

  if (paymentMethod === "Dinheiro") {
    return Banknote;
  }

  return WalletCards;
}

export default function FinancialPage() {
  const [transactions, setTransactions] =
    useState<FinancialTransaction[]>([]);

  const [patients, setPatients] = useState<
    Patient[]
  >([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("Todos");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [procedure, setProcedure] =
    useState("");

  const [amount, setAmount] = useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Não definido");

  const [status, setStatus] =
    useState<FinancialTransactionStatus>(
      "Pendente",
    );

  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadPageData(): Promise<void> {
      try {
        setIsLoading(true);

        const [
          storedTransactions,
          storedPatients,
        ] = await Promise.all([
          getFinancialTransactions(),
          getPatients(),
        ]);

        setTransactions(storedTransactions);
        setPatients(storedPatients);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPageData();
  }, []);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        statusFilter === "Todos" ||
        transaction.status === statusFilter;

      const searchableContent = [
        transaction.patientName,
        transaction.description,
        transaction.procedure,
        transaction.paymentMethod,
        transaction.status,
        transaction.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableContent.includes(
          normalizedSearch,
        );

      return matchesStatus && matchesSearch;
    });
  }, [
    transactions,
    searchTerm,
    statusFilter,
  ]);

  const paidTotal = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.status === "Pago",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        ),
    [transactions],
  );

  const pendingTotal = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.status === "Pendente",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        ),
    [transactions],
  );

  const overdueTotal = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.status === "Vencido",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        ),
    [transactions],
  );

  const expectedTotal =
    paidTotal + pendingTotal + overdueTotal;

  function resetForm(): void {
    setPatientId("");
    setDescription("");
    setProcedure("");
    setAmount("");
    setDueDate("");
    setPaymentMethod("Não definido");
    setStatus("Pendente");
    setNotes("");
    setFormError("");
  }

  function closeForm(): void {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    try {
      setIsSaving(true);
      setFormError("");

      const patient = patients.find(
        (item) => item.id === patientId,
      );

      if (!patient) {
        throw new Error(
          "Selecione um paciente.",
        );
      }

      const numericAmount = Number(
        amount.replace(",", "."),
      );

      const input: CreateFinancialTransactionInput =
        {
          patientId: patient.id,
          patientName: patient.name,
          description,
          procedure,
          amount: numericAmount,
          dueDate,
          paymentMethod,
          status,
          notes,
        };

      const newTransaction =
        await createFinancialTransaction(input);

      setTransactions((currentTransactions) => [
        newTransaction,
        ...currentTransactions,
      ]);

      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o lançamento.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(
    transaction: FinancialTransaction,
    newStatus: FinancialTransactionStatus,
  ): Promise<void> {
    try {
      const updatedTransaction =
        await updateFinancialTransactionStatus(
          transaction.id,
          {
            status: newStatus,
            paymentMethod:
              transaction.paymentMethod,
          },
        );

      setTransactions(
        (currentTransactions) =>
          currentTransactions.map((item) =>
            item.id === updatedTransaction.id
              ? updatedTransaction
              : item,
          ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar o status.",
      );
    }
  }

  async function handleDelete(
    transaction: FinancialTransaction,
  ): Promise<void> {
    const shouldDelete = window.confirm(
      `Deseja excluir o lançamento de ${transaction.patientName}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(transaction.id);

      await deleteFinancialTransaction(
        transaction.id,
      );

      setTransactions(
        (currentTransactions) =>
          currentTransactions.filter(
            (item) =>
              item.id !== transaction.id,
          ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o lançamento.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <WalletCards size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Financeiro
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Controle receitas, pagamentos e
                pendências da clínica.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Novo lançamento
        </button>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Receita total
              </p>

              <strong className="mt-2 block text-2xl">
                {formatCurrency(expectedTotal)}
              </strong>

              <p className="mt-2 text-xs text-muted-foreground">
                Pago, pendente e vencido
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <CircleDollarSign size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Recebido
              </p>

              <strong className="mt-2 block text-2xl">
                {formatCurrency(paidTotal)}
              </strong>

              <p className="mt-2 text-xs text-muted-foreground">
                Pagamentos concluídos
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Pendente
              </p>

              <strong className="mt-2 block text-2xl">
                {formatCurrency(pendingTotal)}
              </strong>

              <p className="mt-2 text-xs text-muted-foreground">
                Aguardando pagamento
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Clock3 size={22} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Vencido
              </p>

              <strong className="mt-2 block text-2xl">
                {formatCurrency(overdueTotal)}
              </strong>

              <p className="mt-2 text-xs text-muted-foreground">
                Necessita acompanhamento
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              <TriangleAlert size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Pesquisar paciente, procedimento ou pagamento..."
              className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="relative block">
            <Filter
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter,
                )
              }
              className="h-11 w-full appearance-none rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Todos">
                Todos os status
              </option>

              {statusOptions.map(
                (statusOption) => (
                  <option
                    key={statusOption}
                    value={statusOption}
                  >
                    {statusOption}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {filteredTransactions.length}{" "}
          {filteredTransactions.length === 1
            ? "lançamento encontrado"
            : "lançamentos encontrados"}
        </p>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-muted"
                />
              ),
            )}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText
                size={25}
                className="text-muted-foreground"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Nenhum lançamento encontrado
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste os filtros ou crie um novo
              lançamento financeiro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b bg-muted/40">
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-4 font-semibold">
                    Paciente
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Descrição
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Vencimento
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Pagamento
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Valor
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredTransactions.map(
                  (transaction) => {
                    const PaymentIcon =
                      getPaymentMethodIcon(
                        transaction.paymentMethod,
                      );

                    const isDeleting =
                      deletingId === transaction.id;

                    return (
                      <tr
                        key={transaction.id}
                        className="transition hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/prontuarios/${transaction.patientId}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              <UserRound size={17} />
                            </div>

                            <div>
                              <p className="font-medium">
                                {
                                  transaction.patientName
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Abrir prontuário
                              </p>
                            </div>
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {
                              transaction.description
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              transaction.procedure
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays
                              size={15}
                              className="text-muted-foreground"
                            />

                            {formatDate(
                              transaction.dueDate,
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <PaymentIcon
                              size={16}
                              className="text-muted-foreground"
                            />

                            <div>
                              <p className="text-sm">
                                {
                                  transaction.paymentMethod
                                }
                              </p>

                              {transaction.paymentDate && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {
                                    formatDate(
                                      transaction.paymentDate,
                                    )
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <strong>
                            {formatCurrency(
                              transaction.amount,
                            )}
                          </strong>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={transaction.status}
                            onChange={(event) =>
                              void handleStatusChange(
                                transaction,
                                event.target
                                  .value as FinancialTransactionStatus,
                              )
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyles(
                              transaction.status,
                            )}`}
                          >
                            {statusOptions.map(
                              (statusOption) => (
                                <option
                                  key={
                                    statusOption
                                  }
                                  value={
                                    statusOption
                                  }
                                >
                                  {
                                    statusOption
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() =>
                                void handleDelete(
                                  transaction,
                                )
                              }
                              title="Excluir lançamento"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Fechar formulário"
            onClick={closeForm}
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-background shadow-2xl">
            <header className="sticky top-0 flex items-center justify-between border-b bg-background px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  Novo lançamento
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Registre uma cobrança ou
                  pagamento.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
              >
                <X size={19} />
              </button>
            </header>

            <form
              onSubmit={(event) =>
                void handleSubmit(event)
              }
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  {formError}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Paciente
                </span>

                <select
                  required
                  value={patientId}
                  onChange={(event) =>
                    setPatientId(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Selecione um paciente
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Descrição
                  </span>

                  <input
                    required
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Consulta odontológica"
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Procedimento
                  </span>

                  <input
                    required
                    value={procedure}
                    onChange={(event) =>
                      setProcedure(
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Avaliação"
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Valor
                  </span>

                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    placeholder="0,00"
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Vencimento
                  </span>

                  <input
                    required
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Status inicial
                  </span>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target
                          .value as FinancialTransactionStatus,
                      )
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {statusOptions.map(
                      (statusOption) => (
                        <option
                          key={statusOption}
                          value={statusOption}
                        >
                          {statusOption}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Forma de pagamento
                  </span>

                  <select
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target
                          .value as PaymentMethod,
                      )
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {paymentMethodOptions.map(
                      (method) => (
                        <option
                          key={method}
                          value={method}
                        >
                          {method}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Observações
                </span>

                <textarea
                  rows={4}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Informações adicionais sobre o lançamento..."
                  className="w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <footer className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={closeForm}
                  className="h-11 rounded-xl border px-5 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Salvando..."
                    : "Salvar lançamento"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}