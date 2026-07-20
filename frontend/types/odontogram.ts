export type ToothStatus =
  | "healthy"
  | "caries"
  | "restoration"
  | "root-canal"
  | "implant"
  | "extracted";

export interface Tooth {
  number: number;
  name: string;
  status: ToothStatus;
  notes?: string;
}

export interface ToothHistoryEntry {
  id: string;
  toothNumber: number;
  toothName: string;

  previousStatus: ToothStatus;
  newStatus: ToothStatus;

  previousNotes?: string;
  newNotes?: string;

  professional: string;
  createdAt: string;
}

export interface Odontogram {
  patientId: string;
  teeth: Tooth[];
  updatedAt: string;

  /*
   * Opcional para manter compatibilidade com odontogramas
   * que já foram salvos anteriormente no localStorage.
   */
  history?: ToothHistoryEntry[];
}

export interface ToothStatusOption {
  value: ToothStatus;
  label: string;
  description: string;
}

export const toothStatusOptions: ToothStatusOption[] = [
  {
    value: "healthy",
    label: "Saudável",
    description: "Sem alterações clínicas registradas.",
  },
  {
    value: "caries",
    label: "Cárie",
    description: "Dente com presença de lesão cariosa.",
  },
  {
    value: "restoration",
    label: "Restauração",
    description: "Dente restaurado ou com restauração indicada.",
  },
  {
    value: "root-canal",
    label: "Tratamento de canal",
    description: "Tratamento endodôntico realizado ou indicado.",
  },
  {
    value: "implant",
    label: "Implante",
    description: "Elemento substituído por implante dentário.",
  },
  {
    value: "extracted",
    label: "Extraído",
    description: "Dente ausente por extração.",
  },
];

export const permanentTeeth: Tooth[] = [
  {
    number: 18,
    name: "Terceiro molar superior direito",
    status: "healthy",
  },
  {
    number: 17,
    name: "Segundo molar superior direito",
    status: "healthy",
  },
  {
    number: 16,
    name: "Primeiro molar superior direito",
    status: "healthy",
  },
  {
    number: 15,
    name: "Segundo pré-molar superior direito",
    status: "healthy",
  },
  {
    number: 14,
    name: "Primeiro pré-molar superior direito",
    status: "healthy",
  },
  {
    number: 13,
    name: "Canino superior direito",
    status: "healthy",
  },
  {
    number: 12,
    name: "Incisivo lateral superior direito",
    status: "healthy",
  },
  {
    number: 11,
    name: "Incisivo central superior direito",
    status: "healthy",
  },
  {
    number: 21,
    name: "Incisivo central superior esquerdo",
    status: "healthy",
  },
  {
    number: 22,
    name: "Incisivo lateral superior esquerdo",
    status: "healthy",
  },
  {
    number: 23,
    name: "Canino superior esquerdo",
    status: "healthy",
  },
  {
    number: 24,
    name: "Primeiro pré-molar superior esquerdo",
    status: "healthy",
  },
  {
    number: 25,
    name: "Segundo pré-molar superior esquerdo",
    status: "healthy",
  },
  {
    number: 26,
    name: "Primeiro molar superior esquerdo",
    status: "healthy",
  },
  {
    number: 27,
    name: "Segundo molar superior esquerdo",
    status: "healthy",
  },
  {
    number: 28,
    name: "Terceiro molar superior esquerdo",
    status: "healthy",
  },

  {
    number: 48,
    name: "Terceiro molar inferior direito",
    status: "healthy",
  },
  {
    number: 47,
    name: "Segundo molar inferior direito",
    status: "healthy",
  },
  {
    number: 46,
    name: "Primeiro molar inferior direito",
    status: "healthy",
  },
  {
    number: 45,
    name: "Segundo pré-molar inferior direito",
    status: "healthy",
  },
  {
    number: 44,
    name: "Primeiro pré-molar inferior direito",
    status: "healthy",
  },
  {
    number: 43,
    name: "Canino inferior direito",
    status: "healthy",
  },
  {
    number: 42,
    name: "Incisivo lateral inferior direito",
    status: "healthy",
  },
  {
    number: 41,
    name: "Incisivo central inferior direito",
    status: "healthy",
  },
  {
    number: 31,
    name: "Incisivo central inferior esquerdo",
    status: "healthy",
  },
  {
    number: 32,
    name: "Incisivo lateral inferior esquerdo",
    status: "healthy",
  },
  {
    number: 33,
    name: "Canino inferior esquerdo",
    status: "healthy",
  },
  {
    number: 34,
    name: "Primeiro pré-molar inferior esquerdo",
    status: "healthy",
  },
  {
    number: 35,
    name: "Segundo pré-molar inferior esquerdo",
    status: "healthy",
  },
  {
    number: 36,
    name: "Primeiro molar inferior esquerdo",
    status: "healthy",
  },
  {
    number: 37,
    name: "Segundo molar inferior esquerdo",
    status: "healthy",
  },
  {
    number: 38,
    name: "Terceiro molar inferior esquerdo",
    status: "healthy",
  },
];