import type { Patient } from "@/types/patient";

export interface TemplateRenderValues {
  patient: Patient;
  professional?: {
    name?: string;
    cro?: string;
  };
  clinic?: {
    name?: string;
    cnpj?: string;
    city?: string;
    state?: string;
  };
  guardian?: {
    name?: string;
    cpf?: string;
    rg?: string;
  };
  document?: Record<string, string | number | undefined>;
  treatment?: Record<string, string | number | undefined>;
  payment?: Record<string, string | number | undefined>;
  sedation?: Record<string, string | number | undefined>;
  recipient?: Record<string, string | number | undefined>;
}

function formatBirthDate(date?: string): string {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR").format(
    parsedDate,
  );
}

function getValueByPath(
  values: Record<string, unknown>,
  path: string,
): string {
  const result = path
    .split(".")
    .reduce<unknown>((current, key) => {
      if (
        current &&
        typeof current === "object" &&
        key in current
      ) {
        return (
          current as Record<string, unknown>
        )[key];
      }

      return undefined;
    }, values);

  if (result === null || result === undefined) {
    return "";
  }

  return String(result);
}

export function renderDocumentTemplate(
  content: string,
  values: TemplateRenderValues,
): string {
  const normalizedValues = {
    ...values,
    patient: {
      ...values.patient,
      birthDate: formatBirthDate(
        values.patient.birthDate,
      ),
      cpf: values.patient.cpf ?? "",
      rg: values.patient.rg ?? "",
      address: values.patient.address ?? "",
    },
    guardian: {
      name:
        values.guardian?.name ??
        values.patient.guardianName ??
        "",
      cpf:
        values.guardian?.cpf ??
        values.patient.guardianCpf ??
        "",
      rg:
        values.guardian?.rg ??
        values.patient.guardianRg ??
        "",
    },
    professional: {
      name:
        values.professional?.name ??
        "Dr. Victor Valadares",
      cro:
        values.professional?.cro ??
        "74639",
    },
    clinic: {
      name:
        values.clinic?.name ??
        "Clínica Dr. Victor Valadares",
      cnpj: values.clinic?.cnpj ?? "",
      city:
        values.clinic?.city ??
        "Pará de Minas",
      state:
        values.clinic?.state ??
        "MG",
    },
  };

  return content.replace(
    /\{\{\s*([^}]+?)\s*\}\}/g,
    (_, path: string) =>
      getValueByPath(
        normalizedValues as Record<string, unknown>,
        path.trim(),
      ),
  );
}

export function extractTemplateVariables(
  content: string,
): string[] {
  const variables = Array.from(
    content.matchAll(
      /\{\{\s*([^}]+?)\s*\}\}/g,
    ),
  ).map((match) => match[1].trim());

  return Array.from(new Set(variables)).sort();
}