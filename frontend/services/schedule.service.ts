import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/types/appointment";

const STORAGE_KEY =
  "victor-valadares-appointments";

const defaultAppointments: Appointment[] = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    patient: "Mariana Oliveira",
    procedure: "Avaliação",
    professional: "Dr. Victor Valadares",
    date: "2026-07-14",
    time: "08:30",
    duration: 60,
    status: "Confirmada",
    notes:
      "Primeira avaliação odontológica da paciente.",
    createdAt: "2026-07-10T11:30:00.000Z",
  },
  {
    id: "appointment-2",
    patientId: "patient-2",
    patient: "Carlos Henrique",
    procedure: "Limpeza",
    professional: "Dr. Victor Valadares",
    date: "2026-07-14",
    time: "10:00",
    duration: 60,
    status: "Confirmada",
    createdAt: "2026-07-11T14:00:00.000Z",
  },
  {
    id: "appointment-3",
    patientId: "patient-3",
    patient: "Amanda Souza",
    procedure: "Restauração",
    professional: "Dr. Victor Valadares",
    date: "2026-07-14",
    time: "13:30",
    duration: 90,
    status: "Pendente",
    notes:
      "Confirmar presença antes do atendimento.",
    createdAt: "2026-07-12T15:20:00.000Z",
  },
  {
    id: "appointment-4",
    patientId: "patient-4",
    patient: "Rafael Martins",
    procedure: "Retorno",
    professional: "Dr. Victor Valadares",
    date: "2026-07-14",
    time: "15:00",
    duration: 45,
    status: "Confirmada",
    createdAt: "2026-07-12T17:00:00.000Z",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function saveAppointments(
  appointments: Appointment[],
): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appointments),
  );
}

function sortAppointments(
  appointments: Appointment[],
): Appointment[] {
  return [...appointments].sort(
    (firstAppointment, secondAppointment) => {
      const firstDateTime = new Date(
        `${firstAppointment.date}T${firstAppointment.time}:00`,
      ).getTime();

      const secondDateTime = new Date(
        `${secondAppointment.date}T${secondAppointment.time}:00`,
      ).getTime();

      return firstDateTime - secondDateTime;
    },
  );
}

function validateAppointmentInput(
  input: CreateAppointmentInput,
): void {
  if (!input.patientId.trim()) {
    throw new Error("Selecione um paciente.");
  }

  if (!input.patient.trim()) {
    throw new Error(
      "O nome do paciente não foi informado.",
    );
  }

  if (!input.procedure.trim()) {
    throw new Error("Informe o procedimento.");
  }

  if (!input.professional.trim()) {
    throw new Error("Informe o profissional.");
  }

  if (!input.date) {
    throw new Error("Informe a data da consulta.");
  }

  if (!input.time) {
    throw new Error("Informe o horário da consulta.");
  }

  if (
    !Number.isFinite(input.duration) ||
    input.duration <= 0
  ) {
    throw new Error(
      "Informe uma duração válida para a consulta.",
    );
  }
}

function hasScheduleConflict(
  appointments: Appointment[],
  input: CreateAppointmentInput,
  ignoredAppointmentId?: string,
): boolean {
  if (input.status === "Cancelada") {
    return false;
  }

  const appointmentStart = new Date(
    `${input.date}T${input.time}:00`,
  ).getTime();

  const appointmentEnd =
    appointmentStart +
    input.duration * 60 * 1000;

  return appointments.some((appointment) => {
    if (appointment.id === ignoredAppointmentId) {
      return false;
    }

    if (
      appointment.status === "Cancelada" ||
      appointment.professional !==
        input.professional ||
      appointment.date !== input.date
    ) {
      return false;
    }

    const existingStart = new Date(
      `${appointment.date}T${appointment.time}:00`,
    ).getTime();

    const existingEnd =
      existingStart +
      appointment.duration * 60 * 1000;

    return (
      appointmentStart < existingEnd &&
      appointmentEnd > existingStart
    );
  });
}

export async function getAppointments(): Promise<
  Appointment[]
> {
  if (!isBrowser()) {
    return sortAppointments(defaultAppointments);
  }

  const storedAppointments =
    localStorage.getItem(STORAGE_KEY);

  if (!storedAppointments) {
    saveAppointments(defaultAppointments);

    return sortAppointments(defaultAppointments);
  }

  try {
    const parsedAppointments = JSON.parse(
      storedAppointments,
    ) as Appointment[];

    if (!Array.isArray(parsedAppointments)) {
      saveAppointments(defaultAppointments);

      return sortAppointments(defaultAppointments);
    }

    return sortAppointments(parsedAppointments);
  } catch {
    saveAppointments(defaultAppointments);

    return sortAppointments(defaultAppointments);
  }
}

export async function getAppointmentById(
  appointmentId: string,
): Promise<Appointment | null> {
  const appointments = await getAppointments();

  return (
    appointments.find(
      (appointment) =>
        appointment.id === appointmentId,
    ) ?? null
  );
}

export async function getAppointmentsByDate(
  date: string,
): Promise<Appointment[]> {
  const appointments = await getAppointments();

  return sortAppointments(
    appointments.filter(
      (appointment) => appointment.date === date,
    ),
  );
}

export async function getAppointmentsByPatientId(
  patientId: string,
): Promise<Appointment[]> {
  const appointments = await getAppointments();

  return sortAppointments(
    appointments.filter(
      (appointment) =>
        appointment.patientId === patientId,
    ),
  );
}

export async function getAppointmentsByPeriod(
  startDate: string,
  endDate: string,
): Promise<Appointment[]> {
  const appointments = await getAppointments();

  return sortAppointments(
    appointments.filter(
      (appointment) =>
        appointment.date >= startDate &&
        appointment.date <= endDate,
    ),
  );
}

export async function getUpcomingAppointments(
  limit?: number,
): Promise<Appointment[]> {
  const appointments = await getAppointments();

  const currentDateTime = Date.now();

  const upcomingAppointments =
    appointments.filter((appointment) => {
      if (
        appointment.status === "Cancelada" ||
        appointment.status === "Concluída"
      ) {
        return false;
      }

      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}:00`,
      ).getTime();

      return appointmentDateTime >= currentDateTime;
    });

  if (
    typeof limit === "number" &&
    limit > 0
  ) {
    return upcomingAppointments.slice(0, limit);
  }

  return upcomingAppointments;
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  if (!isBrowser()) {
    throw new Error(
      "A consulta precisa ser criada no navegador.",
    );
  }

  validateAppointmentInput(input);

  const appointments = await getAppointments();

  if (hasScheduleConflict(appointments, input)) {
    throw new Error(
      "Já existe uma consulta para esse profissional no período selecionado.",
    );
  }

  const newAppointment: Appointment = {
    id: crypto.randomUUID(),
    patientId: input.patientId,
    patient: input.patient.trim(),
    procedure: input.procedure.trim(),
    professional: input.professional.trim(),
    date: input.date,
    time: input.time,
    duration: input.duration,
    status: input.status,
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  saveAppointments([
    ...appointments,
    newAppointment,
  ]);

  return newAppointment;
}

export async function updateAppointment(
  appointmentId: string,
  input: UpdateAppointmentInput,
): Promise<Appointment> {
  if (!isBrowser()) {
    throw new Error(
      "A consulta precisa ser editada no navegador.",
    );
  }

  validateAppointmentInput(input);

  const appointments = await getAppointments();

  const existingAppointment =
    appointments.find(
      (appointment) =>
        appointment.id === appointmentId,
    );

  if (!existingAppointment) {
    throw new Error("Consulta não encontrada.");
  }

  if (
    hasScheduleConflict(
      appointments,
      input,
      appointmentId,
    )
  ) {
    throw new Error(
      "Já existe uma consulta para esse profissional no período selecionado.",
    );
  }

  const updatedAppointment: Appointment = {
    ...existingAppointment,
    patientId: input.patientId,
    patient: input.patient.trim(),
    procedure: input.procedure.trim(),
    professional: input.professional.trim(),
    date: input.date,
    time: input.time,
    duration: input.duration,
    status: input.status,
    notes: input.notes?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  const updatedAppointments =
    appointments.map((appointment) =>
      appointment.id === appointmentId
        ? updatedAppointment
        : appointment,
    );

  saveAppointments(updatedAppointments);

  return updatedAppointment;
}

export async function deleteAppointment(
  appointmentId: string,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error(
      "A consulta precisa ser excluída no navegador.",
    );
  }

  const appointments = await getAppointments();

  const appointmentExists = appointments.some(
    (appointment) =>
      appointment.id === appointmentId,
  );

  if (!appointmentExists) {
    throw new Error("Consulta não encontrada.");
  }

  const updatedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.id !== appointmentId,
    );

  saveAppointments(updatedAppointments);
}