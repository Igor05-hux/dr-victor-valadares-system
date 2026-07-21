"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppointmentCard } from "@/components/schedule/appointment-card";
import { AppointmentFormModal } from "@/components/schedule/appointment-form-modal";
import { ScheduleFilters } from "@/components/schedule/schedule-filters";
import { ScheduleSummary } from "@/components/schedule/schedule-summary";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getPatients } from "@/services/patient.service";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "@/services/schedule.service";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
} from "@/types/appointment";
import type { Patient } from "@/types/patient";

interface WeekDay {
  day: string;
  dateLabel: string;
  date: string;
}

function createDateFromValue(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

function getTodayValue(): string {
  return formatDateValue(new Date());
}

function getStartOfWeek(dateValue: string): Date {
  const date = createDateFromValue(dateValue);
  const day = date.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

  return date;
}

function getWeekDays(dateValue: string): WeekDay[] {
  const startOfWeek = getStartOfWeek(dateValue);

  const dayLabels = [
    "SEG",
    "TER",
    "QUA",
    "QUI",
    "SEX",
    "SÁB",
  ];

  return dayLabels.map((day, index) => {
    const date = new Date(startOfWeek);

    date.setDate(
      startOfWeek.getDate() + index,
    );

    return {
      day,
      dateLabel: String(
        date.getDate(),
      ).padStart(2, "0"),
      date: formatDateValue(date),
    };
  });
}

function formatMonthYear(
  dateValue: string,
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(createDateFromValue(dateValue));
}

function formatWeekPeriod(
  dateValue: string,
): string {
  const weekDays = getWeekDays(dateValue);

  return `Semana de ${Number(
    weekDays[0].dateLabel,
  )} a ${Number(
    weekDays[weekDays.length - 1].dateLabel,
  )} de ${formatMonthYear(dateValue)}`;
}

function getStatusSuccessMessage(
  status: AppointmentStatus,
): string {
  const messages: Record<
    AppointmentStatus,
    string
  > = {
    Pendente:
      "Consulta marcada como pendente.",
    Confirmada:
      "Consulta confirmada com sucesso.",
    Concluída:
      "Consulta concluída com sucesso.",
    Cancelada:
      "Consulta cancelada com sucesso.",
  };

  return messages[status];
}

export default function AgendaPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);
  const [patients, setPatients] = useState<
    Patient[]
  >([]);

  const [selectedDate, setSelectedDate] =
    useState(getTodayValue);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    professionalFilter,
    setProfessionalFilter,
  ] = useState("Todos");

  const [statusFilter, setStatusFilter] =
    useState<"Todos" | AppointmentStatus>(
      "Todos",
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<Appointment | null>(null);

  const [
    appointmentToDelete,
    setAppointmentToDelete,
  ] = useState<Appointment | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setPageError("");

      const [
        loadedAppointments,
        loadedPatients,
      ] = await Promise.all([
        getAppointments(),
        getPatients(),
      ]);

      setAppointments(loadedAppointments);
      setPatients(loadedPatients);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar a agenda.";

      setPageError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const weekDays = useMemo(
    () => getWeekDays(selectedDate),
    [selectedDate],
  );

  const dayAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            appointment.date === selectedDate,
        )
        .sort((first, second) =>
          first.time.localeCompare(second.time),
        ),
    [appointments, selectedDate],
  );

  const professionals = useMemo(() => {
    return Array.from(
      new Set(
        appointments
          .map(
            (appointment) =>
              appointment.professional,
          )
          .filter(Boolean),
      ),
    ).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const normalizedSearchTerm =
      searchTerm.trim().toLocaleLowerCase(
        "pt-BR",
      );

    return dayAppointments.filter(
      (appointment) => {
        const matchesSearch =
          normalizedSearchTerm === "" ||
          appointment.patient
            .toLocaleLowerCase("pt-BR")
            .includes(normalizedSearchTerm) ||
          appointment.procedure
            .toLocaleLowerCase("pt-BR")
            .includes(normalizedSearchTerm);

        const matchesProfessional =
          professionalFilter === "Todos" ||
          appointment.professional ===
            professionalFilter;

        const matchesStatus =
          statusFilter === "Todos" ||
          appointment.status === statusFilter;

        return (
          matchesSearch &&
          matchesProfessional &&
          matchesStatus
        );
      },
    );
  }, [
    dayAppointments,
    professionalFilter,
    searchTerm,
    statusFilter,
  ]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    professionalFilter !== "Todos" ||
    statusFilter !== "Todos";

  function openCreateForm() {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  }

  function openEditForm(
    appointment: Appointment,
  ) {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  }

  function clearFilters() {
    setSearchTerm("");
    setProfessionalFilter("Todos");
    setStatusFilter("Todos");
  }

  async function handleFormSubmit(
    input: CreateAppointmentInput,
  ) {
    try {
      setPageError("");

      if (selectedAppointment) {
        await updateAppointment(
          selectedAppointment.id,
          input,
        );

        toast.success(
          "Consulta atualizada com sucesso.",
          {
            description: `${input.patient} — ${input.date} às ${input.time}`,
          },
        );
      } else {
        await createAppointment(input);

        toast.success(
          "Consulta criada com sucesso.",
          {
            description: `${input.patient} — ${input.date} às ${input.time}`,
          },
        );
      }

      setSelectedDate(input.date);
      closeForm();
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a consulta.";

      setPageError(message);
      toast.error(
        "Não foi possível salvar a consulta.",
        {
          description: message,
        },
      );

      throw error;
    }
  }

  async function handleStatusChange(
    appointment: Appointment,
    status: AppointmentStatus,
  ) {
    try {
      setPageError("");

      await updateAppointment(
        appointment.id,
        {
          patientId: appointment.patientId,
          patient: appointment.patient,
          procedure: appointment.procedure,
          professional:
            appointment.professional,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          status,
          notes: appointment.notes,
        },
      );

      toast.success(
        getStatusSuccessMessage(status),
        {
          description: appointment.patient,
        },
      );

      await loadData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a consulta.";

      setPageError(message);

      toast.error(
        "Não foi possível atualizar o status.",
        {
          description: message,
        },
      );
    }
  }

  function requestDelete(
    appointment: Appointment,
  ) {
    setAppointmentToDelete(appointment);
  }

  function closeDeleteDialog() {
    if (isDeleting) {
      return;
    }

    setAppointmentToDelete(null);
  }

  async function confirmDelete() {
    if (!appointmentToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setPageError("");

      await deleteAppointment(
        appointmentToDelete.id,
      );

      toast.success(
        "Consulta excluída com sucesso.",
        {
          description:
            appointmentToDelete.patient,
        },
      );

      setAppointmentToDelete(null);
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a consulta.";

      setPageError(message);

      toast.error(
        "Não foi possível excluir a consulta.",
        {
          description: message,
        },
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function changeWeek(numberOfDays: number) {
    const date =
      createDateFromValue(selectedDate);

    date.setDate(
      date.getDate() + numberOfDays,
    );

    setSelectedDate(formatDateValue(date));
  }

  function goToToday() {
    setSelectedDate(getTodayValue());
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Agenda
            </h1>

            <p className="text-sm text-muted-foreground">
              Gerencie consultas, horários e
              confirmações.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Nova consulta
          </button>
        </div>

        {pageError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {pageError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    changeWeek(-7)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:bg-muted"
                  aria-label="Semana anterior"
                >
                  <ChevronLeft size={18} />
                </button>

                <div>
                  <h2 className="font-bold capitalize">
                    {formatMonthYear(
                      selectedDate,
                    )}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {formatWeekPeriod(
                      selectedDate,
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    changeWeek(7)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:bg-muted"
                  aria-label="Próxima semana"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Hoje
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  Semana
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {weekDays.map((item) => (
                <button
                  key={item.date}
                  type="button"
                  onClick={() =>
                    setSelectedDate(item.date)
                  }
                  className={`rounded-2xl border p-3 text-center transition ${
                    item.date === selectedDate
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="block text-xs font-semibold opacity-75">
                    {item.day}
                  </span>

                  <strong className="mt-1 block text-xl">
                    {item.dateLabel}
                  </strong>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Carregando consultas...
                </div>
              ) : filteredAppointments.length ===
                0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="font-semibold">
                    {hasActiveFilters
                      ? "Nenhuma consulta encontrada"
                      : "Nenhuma consulta neste dia"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasActiveFilters
                      ? "Tente alterar ou limpar os filtros aplicados."
                      : "Selecione outro dia ou cadastre uma nova consulta."}
                  </p>

                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                    >
                      Limpar filtros
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openCreateForm}
                      className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Nova consulta
                    </button>
                  )}
                </div>
              ) : (
                filteredAppointments.map(
                  (appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={openEditForm}
                      onDelete={requestDelete}
                      onStatusChange={
                        handleStatusChange
                      }
                    />
                  ),
                )
              )}
            </div>
          </article>

          <aside className="space-y-6">
            <ScheduleFilters
              searchTerm={searchTerm}
              professionalFilter={
                professionalFilter
              }
              statusFilter={statusFilter}
              professionals={professionals}
              onSearchChange={setSearchTerm}
              onProfessionalChange={
                setProfessionalFilter
              }
              onStatusChange={
                setStatusFilter
              }
              onClearFilters={clearFilters}
            />

            <ScheduleSummary
              appointments={dayAppointments}
            />
          </aside>
        </div>
      </section>

      <AppointmentFormModal
        isOpen={isFormOpen}
        patients={patients}
        appointment={selectedAppointment}
        initialDate={selectedDate}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <ConfirmationDialog
        isOpen={appointmentToDelete !== null}
        title="Excluir consulta?"
        description={
          appointmentToDelete
            ? `A consulta de ${appointmentToDelete.patient}, marcada para ${appointmentToDelete.date} às ${appointmentToDelete.time}, será excluída permanentemente. Essa ação não poderá ser desfeita.`
            : ""
        }
        confirmLabel="Excluir consulta"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={closeDeleteDialog}
      />
    </DashboardLayout>
  );
}