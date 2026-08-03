import type { DocumentTemplate } from "@/types/document-template";

const CREATED_AT =
  "2026-08-02T12:00:00.000Z";

export const specialDocumentTemplates: DocumentTemplate[] =
  [
    {
      id: "template-conscious-sedation-consent",
      name: "Consentimento para sedação consciente",
      description:
        "Questionário pré-sedação e termo de consentimento para sedação consciente.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO INFORMADO PARA SEDAÇÃO CONSCIENTE

Paciente: {{patient.name}}
CPF: {{patient.cpf}}
RG: {{patient.rg}}

QUESTIONÁRIO PRÉ-SEDAÇÃO

1. Encontra-se constipado(a), com tosse ou algum bloqueio respiratório?
{{sedation.respiratoryBlock}}

2. Teve sinusite ou otite nos últimos 30 dias?
{{sedation.sinusitisOrOtitis}}

3. Possui algum problema respiratório?
{{sedation.respiratoryCondition}}

4. Já realizou cirurgia envolvendo o trato respiratório?
{{sedation.respiratorySurgery}}

5. Está em tratamento de quimioterapia?
{{sedation.chemotherapy}}

6. Possui alguma desordem psicológica ou psiquiátrica?
{{sedation.psychologicalCondition}}

7. Possui porfiria ou alguma doença sanguínea?
{{sedation.bloodCondition}}

8. Utiliza ou utilizou algum medicamento?
{{sedation.medications}}

9. Possui alguma doença sistêmica?
{{sedation.systemicCondition}}

10. Está grávida?
{{sedation.pregnancy}}

CONSENTIMENTO

A sedação consciente é utilizada para tornar o atendimento odontológico mais confortável, mantendo o paciente acordado e capaz de se comunicar verbalmente com o profissional.

Fui informado(a) de que, apesar de ser um procedimento seguro, podem ocorrer variações individuais de resposta e efeitos relacionados aos medicamentos utilizados.

Eu, {{patient.name}}, aceito a realização da sedação consciente após receber explicações sobre os procedimentos, riscos, benefícios e alternativas.

Declaro que forneci informações verdadeiras sobre meu estado de saúde e que tive oportunidade de esclarecer todas as minhas dúvidas.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-pediatric-physical-restraint",
      name: "Consentimento para contenção física",
      description:
        "Autorização para contenção física em odontopediatria e pacientes especiais.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO PARA CONTENÇÃO FÍSICA EM ODONTOPEDIATRIA E PACIENTES ESPECIAIS

Na qualidade de responsável legal pelo(a) paciente {{patient.name}}, eu, {{guardian.name}}, portador(a) do CPF {{guardian.cpf}}, autorizo a utilização de contenção física durante o atendimento odontológico.

Declaro que fui informado(a) de que a contenção física pode ser indicada quando o paciente não coopera com o diagnóstico ou tratamento por questões de maturidade, limitações físicas, condições mentais ou quando outras técnicas de manejo forem insuficientes.

Compreendo que a contenção total ou parcial tem como objetivo proteger o paciente, o profissional e a equipe durante o atendimento.

A contenção poderá ser realizada pelo cirurgião-dentista, auxiliares, pais ou responsáveis, conforme a necessidade clínica.

Declaro que li e compreendi as orientações acima e autorizo a realização do procedimento quando tecnicamente necessário.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{guardian.name}}
Responsável legal


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-image-authorization-adult",
      name: "Autorização de uso de imagem — maior",
      description:
        "Termo de autorização de uso de imagem para paciente maior de idade.",
      category: "authorization",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, residente em {{patient.address}}, autorizo {{clinic.name}}, inscrita no CNPJ {{clinic.cnpj}}, a utilizar minha imagem para fins institucionais, comerciais e publicitários.

A autorização compreende a utilização em:

• Folders, panfletos, catálogos, faixas e cartazes;
• Sites, redes sociais e aplicativos de mensagens;
• Campanhas publicitárias e institucionais;
• Materiais audiovisuais;
• Conteúdos educativos e promocionais.

A presente autorização é concedida de forma gratuita, sem gerar obrigação financeira para a clínica.

Declaro estar ciente da finalidade da utilização e autorizo o uso nos termos deste documento.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}`,
    },
    {
      id: "template-image-authorization-minor",
      name: "Autorização de uso de imagem — menor",
      description:
        "Termo para uso de imagem de paciente menor de idade.",
      category: "authorization",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM DE MENOR

Eu, {{guardian.name}}, portador(a) do CPF {{guardian.cpf}} e RG {{guardian.rg}}, na qualidade de responsável legal por {{patient.name}}, autorizo {{clinic.name}}, inscrita no CNPJ {{clinic.cnpj}}, a utilizar a imagem do menor para fins institucionais, comerciais e publicitários.

A autorização compreende a utilização em:

• Folders, panfletos, catálogos, faixas e cartazes;
• Sites, redes sociais e aplicativos de mensagens;
• Campanhas publicitárias e institucionais;
• Materiais audiovisuais;
• Conteúdos educativos e promocionais.

A autorização é concedida de forma gratuita, sem gerar obrigação financeira para a clínica.

Declaro estar ciente da finalidade da utilização e autorizo o uso nos termos deste documento.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{guardian.name}}
Responsável legal
CPF: {{guardian.cpf}}`,
    },
    {
      id: "template-unaccompanied-minor-authorization",
      name: "Autorização para menor desacompanhado",
      description:
        "Autorização para atendimento odontológico de menor sem acompanhante.",
      category: "authorization",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `AUTORIZAÇÃO PARA ATENDIMENTO ODONTOLÓGICO DE MENOR DESACOMPANHADO

Eu, {{guardian.name}}, portador(a) do CPF {{guardian.cpf}}, na qualidade de responsável legal pelo(a) menor {{patient.name}}, CPF {{patient.cpf}}, autorizo que o(a) paciente compareça desacompanhado(a) às consultas e procedimentos odontológicos realizados em {{clinic.name}}.

Estou ciente de que os procedimentos necessários ao tratamento poderão ser realizados sem minha presença física, conforme planejamento e orientações previamente fornecidos.

Em caso de urgência, a equipe deverá entrar em contato pelo telefone disponibilizado no prontuário.

Declaro que assumo responsabilidade pelas decisões relacionadas ao tratamento do menor e comprometo-me a manter contato com a equipe para esclarecimentos e atualizações.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{guardian.name}}
CPF: {{guardian.cpf}}`,
    },
    {
      id: "template-orthodontic-treatment-withdrawal",
      name: "Desistência de tratamento ortodôntico",
      description:
        "Termo de interrupção e desistência do tratamento ortodôntico.",
      category: "authorization",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `TERMO DE DESISTÊNCIA DE TRATAMENTO ORTODÔNTICO

Eu, {{patient.name}}, inscrito(a) no CPF {{patient.cpf}}, declaro que, por motivos particulares, estou interrompendo meu tratamento ortodôntico.

A partir desta data, assumo responsabilidade pelas consequências decorrentes da interrupção do tratamento e pela guarda dos exames e documentos que me forem entregues.

Declaro que recebi orientações sobre os riscos da interrupção, incluindo perda de resultados, movimentação dentária, alterações oclusais e necessidade de contenções ortodônticas.

Estou ciente de que as contenções e respectivas manutenções poderão não estar incluídas no tratamento principal e que a recusa em utilizá-las pode provocar recidiva.

Declaro que isento {{clinic.name}} e os profissionais responsáveis por consequências decorrentes da minha decisão de interromper o tratamento, ressalvadas as responsabilidades legalmente aplicáveis.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}`,
    },
    {
      id: "template-medical-record-copy-receipt",
      name: "Recibo de cópia do prontuário",
      description:
        "Termo de confirmação de recebimento de cópia do prontuário odontológico.",
      category: "authorization",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `TERMO DE RECEBIMENTO DE CÓPIA DO PRONTUÁRIO

Eu, {{recipient.name}}, portador(a) do CPF {{recipient.cpf}}, na qualidade de paciente ou responsável legal, declaro ter recebido uma cópia do prontuário odontológico de {{patient.name}}, CPF {{patient.cpf}}.

A cópia fornecida contém informações relacionadas ao histórico clínico, exames, tratamentos, prescrições e demais registros pertinentes ao acompanhamento odontológico.

Declaro que a entrega foi realizada de forma clara e completa.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{recipient.name}}
CPF: {{recipient.cpf}}`,
    },
    {
      id: "template-ctz-treatment-consent",
      name: "Consentimento para tratamento CTZ",
      description:
        "Termo de consentimento para tratamento endodôntico em dente decíduo com cimento CTZ.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `TERMO DE CONSENTIMENTO PARA TRATAMENTO COM CTZ

Eu, {{guardian.name}}, portador(a) do CPF {{guardian.cpf}}, na qualidade de responsável legal por {{patient.name}}, autorizo a realização de tratamento endodôntico e restaurador em dente decíduo utilizando cimento CTZ.

Fui informado(a) de que o CTZ é utilizado no tratamento de lesões cariosas profundas e infecções em dentes decíduos, com o objetivo de desinfectar o canal radicular e preservar o dente até sua esfoliação natural.

Possíveis benefícios:

• Evitar extração precoce;
• Aliviar dor;
• Manter a função mastigatória;
• Preservar espaço para o dente permanente.

Possíveis efeitos adversos:

• Escurecimento do dente;
• Necessidade de acompanhamento;
• Necessidade de retratamento;
• Reação alérgica aos componentes;
• Possibilidade de falha terapêutica.

Alternativas ao tratamento:

• Tratamento endodôntico convencional;
• Extração do dente;
• Outra conduta definida pelo profissional.

Declaro que tive oportunidade de fazer perguntas e esclarecer minhas dúvidas. Autorizo a realização do procedimento proposto.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{guardian.name}}
Responsável legal
CPF: {{guardian.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
  ];