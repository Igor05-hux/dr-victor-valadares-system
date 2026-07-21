"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, X } from "lucide-react";

import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
} from "@/types/appointment";
import type { Patient } from "@/types/patient";

interface AppointmentFormModalProps {
  isOpen: boolean;
  patients: Patient[];
  appointment?: Appointment | null;
  initialDate?: string;
  onClose: () => void;
  onSubmit: (
    input: CreateAppointmentInput,
  ) => Promise<void>;
}

interface AppointmentFormState {
  patientId: string;
  procedure: string;
  professional: string;
  date: string;
  time: string;
  duration: string;
  status: AppointmentStatus;
  notes: string;
}

const emptyForm: AppointmentFormState = {
  patientId: "",
  procedure: "",
  professional: "Dr. Victor Valadares",
  date: "",
  time: "",
  duration: "60",
  status: "Pendente",
  notes: "",
};

const appointmentStatuses: AppointmentStatus[] = [
  "Pendente",
  "Confirmada",
  "Concluída",
  "Cancelada",
];

export function AppointmentFormModal({
  isOpen,
  patients,
  appointment,
  initialDate,
  onClose,
  onSubmit,
}: AppointmentFormModalProps) {
  const [form, setForm] =
    useState<AppointmentFormState>(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (appointment) {
      setForm({
        patientId: appointment.patientId,
        procedure: appointment.procedure,
        professional: appointment.professional,
        date: appointment.date,
        time: appointment.time,
        duration: String(appointment.duration),
        status: appointment.status,
        notes: appointment.notes ?? "",
      });

      setError("");
      return;
    }

    setForm({
      ...emptyForm,
      date: initialDate ?? "",
    });

    setError("");
  }, [appointment, initialDate, isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedPatient = patients.find(
    (patient) => patient.id === form.patientId,
  );

  const currentPatientExists =
    appointment &&
    !patients.some(
      (patient) =>
        patient.id === appointment.patientId,
    );

  function updateField<
    Key extends keyof AppointmentFormState,
  >(
    field: Key,
    value: AppointmentFormState[Key],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const patientName =
      selectedPatient?.name ??
      (appointment?.patientId === form.patientId
        ? appointment.patient
        : "");

    if (!form.patientId || !patientName) {
      setError("Selecione um paciente.");
      return;
    }

    const duration = Number(form.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
      setError("Informe uma duração válida.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onSubmit({
        patientId: form.patientId,
        patient: patientName,
        procedure: form.procedure,
        professional: form.professional,
        date: form.date,
        time: form.time,
        duration,
        status: form.status,
        notes: form.notes,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível salvar a consulta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-background shadow-2xl"
      >
        <div className="flex items-start justify-between border-b p-6">
          <div>
            <h2
              id="appointment-modal-title"
              className="text-xl font-bold"
            >
              {appointment
                ? "Editar consulta"
                : "Nova consulta"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Preencha os dados do atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:bg-muted"
            aria-label="Fechar formulário"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="appointment-patient"
              className="mb-2 block text-sm font-semibold"
            >
              Paciente
            </label>

            <select
              id="appointment-patient"
              value={form.patientId}
              onChange={(event) =>
                updateField(
                  "patientId",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
            >
              <option value="">
                Selecione um paciente
              </option>

              {currentPatientExists && (
                <option value={appointment.patientId}>
                  {appointment.patient}
                </option>
              )}

              {patients
                .filter(
                  (patient) =>
                    patient.status === "Ativo",
                )
                .map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="appointment-procedure"
              className="mb-2 block text-sm font-semibold"
            >
              Procedimento
            </label>

            <input
              id="appointment-procedure"
              type="text"
              value={form.procedure}
              onChange={(event) =>
                updateField(
                  "procedure",
                  event.target.value,
                )
              }
              placeholder="Ex.: Limpeza, avaliação ou restauração"
              required
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="appointment-professional"
              className="mb-2 block text-sm font-semibold"
            >
              Profissional
            </label>

            <input
              id="appointment-professional"
              type="text"
              value={form.professional}
              onChange={(event) =>
                updateField(
                  "professional",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-2 block text-sm font-semibold"
              >
                Data
              </label>

              <div className="flex items-center gap-2 rounded-xl border px-3 focus-within:border-blue-600">
                <CalendarDays
                  size={18}
                  className="text-muted-foreground"
                />

                <input
                  id="appointment-date"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    updateField(
                      "date",
                      event.target.value,
                    )
                  }
                  required
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="appointment-time"
                className="mb-2 block text-sm font-semibold"
              >
                Horário
              </label>

              <div className="flex items-center gap-2 rounded-xl border px-3 focus-within:border-blue-600">
                <Clock3
                  size={18}
                  className="text-muted-foreground"
                />

                <input
                  id="appointment-time"
                  type="time"
                  value={form.time}
                  onChange={(event) =>
                    updateField(
                      "time",
                      event.target.value,
                    )
                  }
                  required
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="appointment-duration"
                className="mb-2 block text-sm font-semibold"
              >
                Duração
              </label>

              <select
                id="appointment-duration"
                value={form.duration}
                onChange={(event) =>
                  updateField(
                    "duration",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
              >
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">
                  1 hora e 30 minutos
                </option>
                <option value="120">2 horas</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="appointment-status"
                className="mb-2 block text-sm font-semibold"
              >
                Status
              </label>

              <select
                id="appointment-status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as AppointmentStatus,
                  )
                }
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
              >
                {appointmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="appointment-notes"
              className="mb-2 block text-sm font-semibold"
            >
              Observações
            </label>

            <textarea
              id="appointment-notes"
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Informações adicionais sobre a consulta..."
              className="w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Salvando..."
                : appointment
                  ? "Salvar alterações"
                  : "Agendar consulta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}