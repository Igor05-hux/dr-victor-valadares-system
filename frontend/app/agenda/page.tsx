"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppointmentCard } from "@/components/schedule/appointment-card";
import { AppointmentFormModal } from "@/components/schedule/appointment-form-modal";
import { ScheduleFilters } from "@/components/schedule/schedule-filters";
import { ScheduleSummary } from "@/components/schedule/schedule-summary";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "@/services/schedule.service";
import { getPatients } from "@/services/patient.service";
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

const initialDate = "2026-07-14";

function createDateFromValue(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    date.setDate(startOfWeek.getDate() + index);

    return {
      day,
      dateLabel: String(date.getDate()).padStart(
        2,
        "0",
      ),
      date: formatDateValue(date),
    };
  });
}

function formatMonthYear(dateValue: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(createDateFromValue(dateValue));
}

function formatWeekPeriod(dateValue: string): string {
  const weekDays = getWeekDays(dateValue);

  return `Semana de ${Number(
    weekDays[0].dateLabel,
  )} a ${Number(
    weekDays[weekDays.length - 1].dateLabel,
  )} de ${formatMonthYear(dateValue)}`;
}

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>(
    [],
  );
  const [selectedDate, setSelectedDate] =
    useState(initialDate);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [pageError, setPageError] = useState("");

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
      setPageError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar a agenda.",
      );
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

  const selectedDateAppointments = useMemo(
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

  function openCreateForm() {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  }

  function openEditForm(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  }

  async function handleFormSubmit(
    input: CreateAppointmentInput,
  ) {
    if (selectedAppointment) {
      await updateAppointment(
        selectedAppointment.id,
        input,
      );
    } else {
      await createAppointment(input);
    }

    setSelectedDate(input.date);
    closeForm();
    await loadData();
  }

  async function handleStatusChange(
    appointment: Appointment,
    status: AppointmentStatus,
  ) {
    try {
      setPageError("");

      await updateAppointment(appointment.id, {
        patientId: appointment.patientId,
        patient: appointment.patient,
        procedure: appointment.procedure,
        professional: appointment.professional,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        status,
        notes: appointment.notes,
      });

      await loadData();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a consulta.",
      );
    }
  }

  async function handleDelete(
    appointment: Appointment,
  ) {
    const shouldDelete = window.confirm(
      `Deseja realmente excluir a consulta de ${appointment.patient}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setPageError("");
      await deleteAppointment(appointment.id);
      await loadData();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a consulta.",
      );
    }
  }

  function changeWeek(numberOfDays: number) {
    const date = createDateFromValue(selectedDate);
    date.setDate(date.getDate() + numberOfDays);

    setSelectedDate(formatDateValue(date));
  }

  function goToToday() {
    setSelectedDate(formatDateValue(new Date()));
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
                  onClick={() => changeWeek(-7)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
                  aria-label="Semana anterior"
                >
                  <ChevronLeft size={18} />
                </button>

                <div>
                  <h2 className="font-bold capitalize">
                    {formatMonthYear(selectedDate)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatWeekPeriod(selectedDate)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => changeWeek(7)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
                  aria-label="Próxima semana"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
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
              ) : selectedDateAppointments.length ===
                0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="font-semibold">
                    Nenhuma consulta neste dia
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Selecione outro dia ou cadastre uma
                    nova consulta.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Nova consulta
                  </button>
                </div>
              ) : (
                selectedDateAppointments.map(
                  (appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={openEditForm}
                      onDelete={(item) =>
                        void handleDelete(item)
                      }
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
            <ScheduleFilters />
            <ScheduleSummary />
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
    </DashboardLayout>
  );
}