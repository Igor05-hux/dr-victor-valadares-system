export type FinancialTransactionStatus =
  | "Pendente"
  | "Pago"
  | "Vencido"
  | "Cancelado";

export type PaymentMethod =
  | "PIX"
  | "Cartão de crédito"
  | "Cartão de débito"
  | "Dinheiro"
  | "Convênio"
  | "Não definido";

export interface FinancialTransaction {
  id: string;
  patientId: string;
  patientName: string;
  description: string;
  procedure: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
  status: FinancialTransactionStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFinancialTransactionInput {
  patientId: string;
  patientName: string;
  description: string;
  procedure: string;
  amount: number;
  dueDate: string;
  paymentMethod: PaymentMethod;
  status: FinancialTransactionStatus;
  notes?: string;
}

export type UpdateFinancialTransactionInput =
  CreateFinancialTransactionInput;

export interface UpdateFinancialTransactionStatusInput {
  status: FinancialTransactionStatus;
  paymentMethod?: PaymentMethod;
}