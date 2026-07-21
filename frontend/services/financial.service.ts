import type {
  CreateFinancialTransactionInput,
  FinancialTransaction,
  PaymentMethod,
  UpdateFinancialTransactionStatusInput,
} from "@/types/financial";

const STORAGE_KEY =
  "victor-valadares-financial-transactions";

const defaultTransactions: FinancialTransaction[] = [
  {
    id: "financial-1",
    patientId: "patient-1",
    patientName: "Mariana Oliveira",
    description: "Consulta odontológica",
    procedure: "Avaliação",
    amount: 250,
    dueDate: "2026-07-10",
    paymentDate: "2026-07-10",
    paymentMethod: "PIX",
    status: "Pago",
    notes: "Pagamento realizado no dia da consulta.",
    createdAt: "2026-07-10T11:30:00.000Z",
  },
  {
    id: "financial-2",
    patientId: "patient-2",
    patientName: "Carlos Henrique",
    description: "Procedimento odontológico",
    procedure: "Limpeza",
    amount: 180,
    dueDate: "2026-07-22",
    paymentMethod: "Não definido",
    status: "Pendente",
    createdAt: "2026-07-14T15:00:00.000Z",
  },
  {
    id: "financial-3",
    patientId: "patient-1",
    patientName: "Mariana Oliveira",
    description: "Tratamento restaurador",
    procedure: "Restauração",
    amount: 420,
    dueDate: "2026-06-25",
    paymentMethod: "Cartão de crédito",
    status: "Vencido",
    notes: "Entrar em contato com a paciente.",
    createdAt: "2026-06-18T14:00:00.000Z",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveTransactions(
  transactions: FinancialTransaction[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions),
  );
}

function sortTransactions(
  transactions: FinancialTransaction[],
): FinancialTransaction[] {
  return [...transactions].sort(
    (firstTransaction, secondTransaction) =>
      new Date(secondTransaction.createdAt).getTime() -
      new Date(firstTransaction.createdAt).getTime(),
  );
}

function normalizeTransactionStatus(
  transaction: FinancialTransaction,
): FinancialTransaction {
  if (
    transaction.status !== "Pendente" ||
    !transaction.dueDate
  ) {
    return transaction;
  }

  const dueDate = new Date(`${transaction.dueDate}T23:59:59`);
  const currentDate = new Date();

  if (dueDate.getTime() < currentDate.getTime()) {
    return {
      ...transaction,
      status: "Vencido",
    };
  }

  return transaction;
}

export async function getFinancialTransactions(): Promise<
  FinancialTransaction[]
> {
  if (!isBrowser()) {
    return defaultTransactions;
  }

  const storedTransactions =
    localStorage.getItem(STORAGE_KEY);

  if (!storedTransactions) {
    saveTransactions(defaultTransactions);

    return sortTransactions(defaultTransactions);
  }

  try {
    const parsedTransactions = JSON.parse(
      storedTransactions,
    ) as FinancialTransaction[];

    if (!Array.isArray(parsedTransactions)) {
      saveTransactions(defaultTransactions);

      return sortTransactions(defaultTransactions);
    }

    const normalizedTransactions =
      parsedTransactions.map(normalizeTransactionStatus);

    saveTransactions(normalizedTransactions);

    return sortTransactions(normalizedTransactions);
  } catch {
    saveTransactions(defaultTransactions);

    return sortTransactions(defaultTransactions);
  }
}

export async function createFinancialTransaction(
  input: CreateFinancialTransactionInput,
): Promise<FinancialTransaction> {
  if (!isBrowser()) {
    throw new Error(
      "O lançamento financeiro precisa ser criado no navegador.",
    );
  }

  if (!input.patientId) {
    throw new Error("Selecione um paciente.");
  }

  if (!input.description.trim()) {
    throw new Error("Informe a descrição do lançamento.");
  }

  if (!input.procedure.trim()) {
    throw new Error("Informe o procedimento.");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error(
      "Informe um valor financeiro válido.",
    );
  }

  if (!input.dueDate) {
    throw new Error("Informe a data de vencimento.");
  }

  const transactions =
    await getFinancialTransactions();

  const isPaid = input.status === "Pago";

  const newTransaction: FinancialTransaction = {
    id: crypto.randomUUID(),
    patientId: input.patientId,
    patientName: input.patientName.trim(),
    description: input.description.trim(),
    procedure: input.procedure.trim(),
    amount: input.amount,
    dueDate: input.dueDate,
    paymentDate: isPaid
      ? new Date().toISOString().slice(0, 10)
      : undefined,
    paymentMethod: isPaid
      ? input.paymentMethod
      : input.paymentMethod ?? "Não definido",
    status: input.status,
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  saveTransactions([
    newTransaction,
    ...transactions,
  ]);

  return newTransaction;
}

export async function updateFinancialTransactionStatus(
  transactionId: string,
  input: UpdateFinancialTransactionStatusInput,
): Promise<FinancialTransaction> {
  if (!isBrowser()) {
    throw new Error(
      "O lançamento financeiro precisa ser alterado no navegador.",
    );
  }

  const transactions =
    await getFinancialTransactions();

  const transaction = transactions.find(
    (item) => item.id === transactionId,
  );

  if (!transaction) {
    throw new Error(
      "Lançamento financeiro não encontrado.",
    );
  }

  let paymentMethod: PaymentMethod =
    input.paymentMethod ??
    transaction.paymentMethod;

  let paymentDate = transaction.paymentDate;

  if (input.status === "Pago") {
    paymentDate =
      transaction.paymentDate ??
      new Date().toISOString().slice(0, 10);

    if (paymentMethod === "Não definido") {
      paymentMethod = "PIX";
    }
  } else {
    paymentDate = undefined;
  }

  const updatedTransaction: FinancialTransaction = {
    ...transaction,
    status: input.status,
    paymentMethod,
    paymentDate,
  };

  const updatedTransactions = transactions.map(
    (item) =>
      item.id === transactionId
        ? updatedTransaction
        : item,
  );

  saveTransactions(updatedTransactions);

  return updatedTransaction;
}

export async function deleteFinancialTransaction(
  transactionId: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "O lançamento financeiro precisa ser excluído no navegador.",
    );
  }

  const transactions =
    await getFinancialTransactions();

  const transactionExists = transactions.some(
    (transaction) =>
      transaction.id === transactionId,
  );

  if (!transactionExists) {
    throw new Error(
      "Lançamento financeiro não encontrado.",
    );
  }

  const updatedTransactions = transactions.filter(
    (transaction) =>
      transaction.id !== transactionId,
  );

  saveTransactions(updatedTransactions);
}