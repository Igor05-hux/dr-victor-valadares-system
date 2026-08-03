import { prosthesisGraftTemplates } from "@/data/prosthesis-graft-templates";
import { specialDocumentTemplates } from "@/data/special-document-templates";
import type { DocumentTemplate } from "@/types/document-template";

const baseDocumentTemplates: DocumentTemplate[] = [
  {
    id: "template-dental-certificate",
    name: "Atestado odontológico",
    description:
      "Atestado para justificar dispensa de atividades profissionais.",
    category: "declaration",
    isDefault: true,
    isActive: true,
    createdAt: "2026-08-02T12:00:00.000Z",
    content: `ATESTADO ODONTOLÓGICO

Paciente: {{patient.name}}
CPF: {{patient.cpf}}
RG: {{patient.rg}}

Atesto, para fins de dispensa de atividades profissionais, que o(a) Sr(a). {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, esteve sob meus cuidados profissionais no período entre {{document.startTime}} e {{document.endTime}} do dia {{document.attendanceDate}}, devendo permanecer em repouso por {{document.restDays}} dia(s).

{{clinic.city}}, {{document.fullDate}}.


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
  },

  {
    id: "template-attendance-declaration",
    name: "Comprovante de comparecimento",
    description:
      "Declaração de comparecimento do paciente ao consultório.",
    category: "declaration",
    isDefault: true,
    isActive: true,
    createdAt: "2026-08-02T12:00:00.000Z",
    content: `COMPROVANTE DE COMPARECIMENTO

Paciente: {{patient.name}}
CPF: {{patient.cpf}}
RG: {{patient.rg}}

Declaro, para fins de dispensa de atividades profissionais, que o(a) Sr(a). {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, compareceu ao consultório odontológico no período entre {{document.startTime}} e {{document.endTime}} do dia {{document.attendanceDate}}.

{{clinic.city}}, {{document.fullDate}}.


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
  },

  {
    id: "template-service-contract",
    name: "Contrato de prestação de serviços",
    description:
      "Contrato odontológico com aceite do plano de tratamento.",
    category: "contract",
    isDefault: true,
    isActive: true,
    createdAt: "2026-08-02T12:00:00.000Z",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ODONTOLÓGICOS E ACEITE DO PLANO DE TRATAMENTO

CONTRATANTE — PACIENTE

Nome: {{patient.name}}
CPF: {{patient.cpf}}
RG: {{patient.rg}}
Data de nascimento: {{patient.birthDate}}
Telefone: {{patient.phone}}
Endereço: {{patient.address}}

CONTRATADO — CIRURGIÃO-DENTISTA

{{professional.name}}
CRO: {{professional.cro}}

1. OBJETO DO CONTRATO

O presente contrato tem por objeto a prestação de serviços odontológicos conforme avaliação clínica realizada pelo cirurgião-dentista e o plano de tratamento aceito pelo paciente.

2. PLANO DE TRATAMENTO

{{treatment.items}}

Valor total do tratamento: {{treatment.total}}

3. FORMA DE PAGAMENTO

Forma de pagamento: {{payment.method}}
Entrada: {{payment.downPayment}}
Número de parcelas: {{payment.installments}}
Valor de cada parcela: {{payment.installmentValue}}
Vencimento: {{payment.dueDate}}

Observações:
{{payment.notes}}

4. DECLARAÇÕES DO PACIENTE

Declaro que:

• Recebi explicações claras sobre meu diagnóstico e o tratamento proposto.
• Fui informado sobre os benefícios, limitações, riscos e possíveis intercorrências inerentes aos procedimentos odontológicos.
• Tive oportunidade de esclarecer todas as minhas dúvidas.
• Estou ciente de que o sucesso do tratamento também depende da colaboração do paciente, incluindo comparecimento às consultas, higiene bucal adequada e cumprimento das orientações profissionais.
• Estou ciente de que poderá haver necessidade de alterações no plano de tratamento caso ocorram mudanças no quadro clínico durante sua execução.
• Autorizo a realização dos procedimentos descritos neste contrato.

5. FALTAS E CANCELAMENTOS

O paciente compromete-se a comunicar eventuais cancelamentos ou remarcações com antecedência mínima de 24 horas, sempre que possível.

O não comparecimento sem aviso poderá acarretar reagendamento conforme disponibilidade da agenda.

6. GARANTIAS

O cirurgião-dentista compromete-se a executar os procedimentos utilizando técnicas reconhecidas cientificamente e materiais adequados.

O paciente declara estar ciente de que a Odontologia não permite garantir resultados absolutos, uma vez que a resposta biológica varia de indivíduo para indivíduo.

7. DISPOSIÇÕES GERAIS

Este contrato entra em vigor na data de sua assinatura e permanecerá válido durante toda a execução do plano de tratamento.

As partes declaram ter lido, compreendido e aceitado todas as cláusulas acima.

{{clinic.city}}, {{document.fullDate}}.


________________________________________
Assinatura do paciente
{{patient.name}}


________________________________________
Assinatura do cirurgião-dentista
{{professional.name}}
CRO: {{professional.cro}}`,
  },

  ];

export const defaultDocumentTemplates: DocumentTemplate[] = [
  ...baseDocumentTemplates,
  ...prosthesisGraftTemplates,
  ...specialDocumentTemplates,
];
