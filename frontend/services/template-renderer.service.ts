import type { Patient } from "@/types/patient";
import {
  clinicConfig,
  professionalConfig,
} from "@/config/clinic";

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
  professionalConfig.name,
cro:
  values.professional?.cro ??
  professionalConfig.cro,
    },
    clinic: {
      name:
  values.clinic?.name ??
  clinicConfig.name,
cnpj:
  values.clinic?.cnpj ??
  clinicConfig.cnpj,
city:
  values.clinic?.city ??
  clinicConfig.city,
state:
  values.clinic?.state ??
  clinicConfig.state,
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