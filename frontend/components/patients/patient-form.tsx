"use client";

import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(14, "Informe um telefone válido."),
  birthDate: z.string().min(1, "Informe a data de nascimento."),
  cpf: z.string().min(11, "Informe um CPF válido."),
  address: z.string().min(5, "Informe o endereço."),
  notes: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  defaultValues?: Partial<PatientFormData>;
  submitLabel?: string;
  onSubmit: (data: PatientFormData) => Promise<void>;
}

export function PatientForm({
  defaultValues,
  submitLabel = "Cadastrar paciente",
  onSubmit,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      cpf: "",
      address: "",
      notes: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nome completo" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            placeholder="Ex.: Mariana Oliveira"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <input
            {...register("cpf")}
            type="text"
            placeholder="000.000.000-00"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="paciente@email.com"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <Field label="Telefone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="text"
            placeholder="(31) 99999-9999"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <Field label="Data de nascimento" error={errors.birthDate?.message}>
          <input
            {...register("birthDate")}
            type="date"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <Field label="Endereço" error={errors.address?.message}>
          <input
            {...register("address")}
            type="text"
            placeholder="Rua, número, bairro e cidade"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-blue-500"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Observações" error={errors.notes?.message}>
            <textarea
              {...register("notes")}
              rows={5}
              placeholder="Informações adicionais, restrições ou observações."
              className="w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}