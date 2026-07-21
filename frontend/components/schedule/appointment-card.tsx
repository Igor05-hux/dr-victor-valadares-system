"use client";

import {
  Check,
  CheckCircle2,
  Clock3,
  MoreVertical,
  Pencil,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onStatusChange: (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => Promise<void>;
}

const statusStyles: Record<AppointmentStatus, string> = {
  Confirmada:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Pendente:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Cancelada:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  Concluída:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function changeStatus(
    status: AppointmentStatus,
  ) {
    try {
      setIsUpdating(true);
      await onStatusChange(appointment, status);
      setIsMenuOpen(false);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Clock3 size={21} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <strong>{appointment.time}</strong>
            <span className="text-muted-foreground">
              •
            </span>
            <span className="font-semibold">
              {appointment.patient}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {appointment.procedure} ·{" "}
            {appointment.duration} min
          </p>

          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <UserRound size={14} />
            {appointment.professional}
          </p>

          {appointment.notes && (
            <p className="mt-2 max-w-xl text-xs text-muted-foreground">
              {appointment.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
        >
          {appointment.status}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((current) => !current)
            }
            disabled={isUpdating}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-muted disabled:opacity-50"
            aria-label="Ações da consulta"
          >
            <MoreVertical size={17} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-xl border bg-background p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  onEdit(appointment);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <Pencil size={16} />
                Editar consulta
              </button>

              {appointment.status !== "Confirmada" && (
                <button
                  type="button"
                  onClick={() =>
                    void changeStatus("Confirmada")
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <Check size={16} />
                  Confirmar
                </button>
              )}

              {appointment.status !== "Concluída" && (
                <button
                  type="button"
                  onClick={() =>
                    void changeStatus("Concluída")
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <CheckCircle2 size={16} />
                  Marcar como concluída
                </button>
              )}

              {appointment.status !== "Cancelada" && (
                <button
                  type="button"
                  onClick={() =>
                    void changeStatus("Cancelada")
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <XCircle size={16} />
                  Cancelar consulta
                </button>
              )}

              <div className="my-1 border-t" />

              <button
                type="button"
                onClick={() => {
                  onDelete(appointment);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 size={16} />
                Excluir consulta
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}