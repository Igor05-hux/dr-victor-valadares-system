"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  UserRoundPlus,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { MonthlySummary } from "@/components/dashboard/monthly-summary";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getFinancialTransactions } from "@/services/financial.service";
import { getAllMedicalDocuments } from "@/services/medical-document.service";
import { getPatients } from "@/services/patient.service";
import { getAppointments } from "@/services/schedule.service";
import type { Appointment } from "@/types/appointment";
import type { FinancialTransaction } from "@/types/financial";
import type { MedicalDocument } from "@/types/medical-document";
import type { Patient } from "@/types/patient";

const AVAILABLE_SLOTS_PER_BUSINESS_DAY = 8;

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDateInCurrentMonth(
  dateValue: string,
  referenceDate: Date,
): boolean {
  const date = new Date(`${dateValue}T12:00:00`);

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

function isIsoDateInCurrentMonth(
  dateValue: string,
  referenceDate: Date,
): boolean {
  const date = new Date(dateValue);

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

function countBusinessDaysInMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  let businessDays = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const currentDate = new Date(year, month, day);
    const weekDay = currentDate.getDay();

    if (weekDay !== 0 && weekDay !== 6) {
      businessDays += 1;
    }
  }

  return businessDays;
}

function calculatePercentage(
  value: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((value / total) * 100),
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Home() {
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [transactions, setTransactions] = useState<
    FinancialTransaction[]
  >([]);
  const [documents, setDocuments] = useState<
    MedicalDocument[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setPageError("");

      const [
        loadedAppointments,
        loadedPatients,
        loadedTransactions,
        loadedDocuments,
      ] = await Promise.all([
        getAppointments(),
        getPatients(),
        getFinancialTransactions(),
        getAllMedicalDocuments(),
      ]);

      setAppointments(loadedAppointments);
      setPatients(loadedPatients);
      setTransactions(loadedTransactions);
      setDocuments(loadedDocuments);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados do dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const dashboardData = useMemo(() => {
    const currentDate = new Date();
    const today = formatDateValue(currentDate);

    const todayAppointments = appointments
      .filter(
        (appointment) => appointment.date === today,
      )
      .sort((first, second) =>
        first.time.localeCompare(second.time),
      );

    const currentMonthAppointments = appointments.filter(
      (appointment) =>
        isDateInCurrentMonth(
          appointment.date,
          currentDate,
        ),
    );

    const currentMonthActiveAppointments =
      currentMonthAppointments.filter(
        (appointment) =>
          appointment.status !== "Cancelada",
      );

    const confirmedToday = todayAppointments.filter(
      (appointment) =>
        appointment.status === "Confirmada",
    ).length;

    const pendingToday = todayAppointments.filter(
      (appointment) =>
        appointment.status === "Pendente",
    ).length;

    const completedMonth =
      currentMonthAppointments.filter(
        (appointment) =>
          appointment.status === "Concluída",
      ).length;

    const confirmedMonth =
      currentMonthAppointments.filter(
        (appointment) =>
          appointment.status === "Confirmada" ||
          appointment.status === "Concluída",
      ).length;

    const currentMonthTransactions =
      transactions.filter((transaction) =>
        isDateInCurrentMonth(
          transaction.dueDate,
          currentDate,
        ),
      );

    const validMonthTransactions =
      currentMonthTransactions.filter(
        (transaction) =>
          transaction.status !== "Cancelado",
      );

    const projectedRevenue =
      validMonthTransactions.reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );

    const receivedRevenue =
      currentMonthTransactions
        .filter(
          (transaction) =>
            transaction.status === "Pago",
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0,
        );

    const pendingTransactions =
      currentMonthTransactions.filter(
        (transaction) =>
          transaction.status === "Pendente",
      ).length;

    const overdueTransactions =
      currentMonthTransactions.filter(
        (transaction) =>
          transaction.status === "Vencido",
      ).length;

    const activePatients = patients.filter(
      (patient) => patient.status === "Ativo",
    ).length;

    const inactivePatients =
      patients.length - activePatients;

    const businessDays =
      countBusinessDaysInMonth(currentDate);

    const availableSlots =
      businessDays *
      AVAILABLE_SLOTS_PER_BUSINESS_DAY;

    const occupancyRate = calculatePercentage(
      currentMonthActiveAppointments.length,
      availableSlots,
    );

    const completedRate = calculatePercentage(
      completedMonth,
      currentMonthActiveAppointments.length,
    );

    const confirmedRate = calculatePercentage(
      confirmedMonth,
      currentMonthActiveAppointments.length,
    );

    const paymentRate = calculatePercentage(
      receivedRevenue,
      projectedRevenue,
    );

    const documentsCreatedThisMonth =
      documents.filter((document) =>
        isIsoDateInCurrentMonth(
          document.createdAt,
          currentDate,
        ),
      ).length;

    return {
      todayAppointments,
      confirmedToday,
      pendingToday,
      activePatients,
      inactivePatients,
      occupancyRate,
      projectedRevenue,
      receivedRevenue,
      pendingTransactions,
      overdueTransactions,
      completedRate,
      confirmedRate,
      paymentRate,
      documentsCreatedThisMonth,
      totalDocuments: documents.length,
    };
  }, [
    appointments,
    documents,
    patients,
    transactions,
  ]);

  const metrics = [
    {
      title: "Consultas hoje",
      value: String(
        dashboardData.todayAppointments.length,
      ),
      description:
        dashboardData.pendingToday > 0
          ? `${dashboardData.pendingToday} aguardando confirmação`
          : `${dashboardData.confirmedToday} confirmadas`,
      icon: CalendarCheck,
    },
    {
      title: "Pacientes ativos",
      value: String(dashboardData.activePatients),
      description:
        dashboardData.inactivePatients > 0
          ? `${dashboardData.inactivePatients} pacientes inativos`
          : `${patients.length} pacientes cadastrados`,
      icon: UserRoundPlus,
    },
    {
      title: "Taxa de ocupação",
      value: `${dashboardData.occupancyRate}%`,
      description:
        "Com base nos horários disponíveis do mês",
      icon: Clock3,
    },
    {
      title: "Receita prevista",
      value: formatCurrency(
        dashboardData.projectedRevenue,
      ),
      description: `${formatCurrency(
        dashboardData.receivedRevenue,
      )} recebidos neste mês`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Visão geral
          </h1>

          <p className="text-sm text-muted-foreground">
            Acompanhe os principais indicadores do
            consultório.
          </p>
        </div>

        {pageError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {pageError}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={
                isLoading ? "..." : metric.value
              }
              description={
                isLoading
                  ? "Carregando dados..."
                  : metric.description
              }
              icon={metric.icon}
            />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <RecentAppointments
            appointments={
              dashboardData.todayAppointments
            }
            isLoading={isLoading}
          />

          <MonthlySummary
            completedRate={
              dashboardData.completedRate
            }
            confirmedRate={
              dashboardData.confirmedRate
            }
            paymentRate={
              dashboardData.paymentRate
            }
            pendingTransactions={
              dashboardData.pendingTransactions
            }
            overdueTransactions={
              dashboardData.overdueTransactions
            }
            totalDocuments={
              dashboardData.totalDocuments
            }
            documentsCreatedThisMonth={
              dashboardData.documentsCreatedThisMonth
            }
            isLoading={isLoading}
          />
        </section>
      </section>
    </DashboardLayout>
  );
}