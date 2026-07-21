import type { MedicalRecord } from "@/types/medical-record";
import type { ToothHistoryEntry } from "@/types/odontogram";
import type { TimelineEvent } from "@/types/timeline";

export function buildTimelineEvents(
  medicalRecord: MedicalRecord,
  toothHistory: ToothHistoryEntry[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  medicalRecord.evolutions.forEach((evolution) => {
    events.push({
      id: `evolution-${evolution.id}`,
      type: "evolution",
      evolutionId: evolution.id,
      title: evolution.procedure || "Evolução clínica",
      description: evolution.description,
      professional: evolution.professional,
      createdAt: evolution.date,
    });
  });

  medicalRecord.prescriptions.forEach((prescription) => {
    events.push({
      id: `prescription-${prescription.id}`,
      type: "prescription",
      prescriptionId: prescription.id,
      title: "Receita médica",
      description: prescription.observations,
      professional: prescription.professional,
      createdAt: prescription.date,
      medications: prescription.items.map(
        (item) => item.medication,
      ),
    });
  });

  medicalRecord.consultations.forEach((consultation) => {
    events.push({
      id: `consultation-${consultation.id}`,
      type: "consultation",
      consultationId: consultation.id,
      title: consultation.title,
      description: consultation.description,
      professional: consultation.professional,
      createdAt: consultation.date,
      procedure: consultation.title,
    });
  });

  toothHistory.forEach((history) => {
    events.push({
      id: `tooth-${history.id}`,
      type: "odontogram",
      toothHistoryId: history.id,
      title: `Dente ${history.toothNumber}`,
      description: history.newNotes,
      professional: history.professional,
      createdAt: history.createdAt,
      toothNumber: history.toothNumber,
      previousStatus: history.previousStatus,
      newStatus: history.newStatus,
    });
  });

  return events.sort(
    (firstEvent, secondEvent) =>
      new Date(secondEvent.createdAt).getTime() -
      new Date(firstEvent.createdAt).getTime(),
  );
}