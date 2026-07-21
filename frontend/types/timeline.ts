export type TimelineEventType =
  | "consultation"
  | "evolution"
  | "prescription"
  | "odontogram";

interface TimelineEventBase {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  professional?: string;
  createdAt: string;
}

export interface ConsultationTimelineEvent
  extends TimelineEventBase {
  type: "consultation";
  consultationId: string;
  procedure?: string;
  status?: string;
}

export interface EvolutionTimelineEvent
  extends TimelineEventBase {
  type: "evolution";
  evolutionId: string;
}

export interface PrescriptionTimelineEvent
  extends TimelineEventBase {
  type: "prescription";
  prescriptionId: string;
  medications: string[];
}

export interface OdontogramTimelineEvent
  extends TimelineEventBase {
  type: "odontogram";
  toothHistoryId: string;
  toothNumber: number;
  previousStatus: string;
  newStatus: string;
}

export type TimelineEvent =
  | ConsultationTimelineEvent
  | EvolutionTimelineEvent
  | PrescriptionTimelineEvent
  | OdontogramTimelineEvent;