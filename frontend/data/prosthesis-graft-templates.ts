import type { DocumentTemplate } from "@/types/document-template";

const CREATED_AT =
  "2026-08-02T12:00:00.000Z";

export const prosthesisGraftTemplates: DocumentTemplate[] =
  [
    {
      id: "template-consent-implant-prosthesis",
      name: "Consentimento informado de prótese sobre implante",
      description:
        "Termo de consentimento para confecção e instalação de prótese sobre implantes.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO INFORMADO DE PRÓTESE SOBRE IMPLANTE

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, autorizo a confecção e instalação de prótese sobre implante conforme o plano de tratamento apresentado pelo Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}.

PROCEDIMENTO PLANEJADO

{{treatment.description}}

Dentes ou regiões envolvidos:
{{treatment.teeth}}

Entendo que o propósito do tratamento é reabilitar elementos dentários ausentes, buscando restabelecer parcialmente as funções estética, mastigatória, mecânica e fonética.

Fui informado(a) de que a ausência de tratamento pode contribuir para desconforto, doença periodontal, maloclusão, perda óssea, problemas de articulação temporomandibular, alterações na fala e outras complicações.

O Cirurgião-Dentista explicou que existem riscos e possíveis intercorrências, incluindo:

• Fratura ou perda de dentes e componentes;
• Processo inflamatório e dor;
• Lesão em dentes adjacentes, próteses ou restaurações;
• Edema, hematoma ou desconforto;
• Perda da prótese em razão de alterações ósseas ou periodontais;
• Dificuldade de adaptação ou estabilização da prótese;
• Fratura ou afrouxamento de parafusos;
• Necessidade de ajustes, manutenção ou substituição de componentes;
• Alterações estéticas, funcionais ou fonéticas;
• Necessidade de procedimentos complementares.

Estou ciente de que hábitos como bruxismo, apertamento, tabagismo, má higienização e mastigação de alimentos excessivamente duros podem reduzir a longevidade do tratamento.

Compreendo que implantes e próteses não possuem duração ou garantia predeterminadas. A manutenção, troca de parafusos, ajustes, reparos ou substituições poderão gerar custos adicionais.

As consultas destinadas à escolha de cor, formato e tamanho devem ser utilizadas para aprovação desses elementos antes da finalização pelo laboratório. Alterações solicitadas posteriormente poderão exigir nova confecção.

Declaro que recebi orientações sobre higiene, alimentação e retorno periódico para manutenção.

Não me foi garantido resultado absoluto. Compreendo que a resposta biológica e a durabilidade do tratamento variam entre pacientes.

CERTIFICO QUE LI E COMPREENDI ESTE TERMO E QUE TIVE OPORTUNIDADE DE ESCLARECER TODAS AS MINHAS DÚVIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-removable-prosthesis",
      name: "Consentimento informado de prótese removível",
      description:
        "Termo de consentimento para prótese parcial ou total removível.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO INFORMADO DE PRÓTESE REMOVÍVEL

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, autorizo a confecção e instalação de prótese removível, parcial ou total, conforme o plano de tratamento apresentado pelo Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}.

PROCEDIMENTO PLANEJADO

{{treatment.description}}

Entendo que o objetivo do tratamento é reabilitar elementos dentários ausentes e restabelecer parcialmente ou totalmente as funções estética, mastigatória, mecânica e fonética.

Fui informado(a) de que a ausência de tratamento poderá contribuir para desconforto, alterações de oclusão, perda óssea, problemas articulares, alterações de fala e outras complicações.

Compreendo que existem riscos e possíveis intercorrências, incluindo:

• Fratura ou perda de dentes;
• Dor, edema e desconforto;
• Lesão em dentes adjacentes, próteses ou restaurações;
• Dificuldade de adaptação e estabilização;
• Irritação, periodontite, gengivite ou sangramento;
• Necessidade de ajustes ou reembasamento;
• Fratura da prótese;
• Alteração estética, fonética ou mastigatória;
• Necessidade futura de procedimentos adicionais.

Estou ciente de que novas próteses podem parecer estranhas ou desconfortáveis nas primeiras semanas ou meses, podendo ser necessários ajustes periódicos.

Fui informado(a) de que doenças periodontais, perda óssea, bruxismo, tabagismo e outros hábitos podem reduzir a durabilidade e adaptação da prótese.

Por se tratar de um serviço individual e personalizado, poderá haver necessidade de mais consultas do que inicialmente previsto.

Serviços complementares, ajustes posteriores, reparos e reembasamentos poderão ser cobrados separadamente.

Declaro que recebi orientações sobre higienização, conservação, utilização e acompanhamento periódico.

Não me foi garantido resultado absoluto, pois a resposta e adaptação variam entre os pacientes.

CERTIFICO QUE LI E COMPREENDI ESTE TERMO E QUE TIVE OPORTUNIDADE DE ESCLARECER TODAS AS MINHAS DÚVIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-biomaterial-graft",
      name: "Consentimento para enxerto de biomaterial",
      description:
        "Termo de consentimento para cirurgia de enxerto ósseo com biomaterial.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO PARA CIRURGIA DE ENXERTO DE BIOMATERIAL

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, declaro que o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, esclareceu os objetivos, riscos, custos e alternativas relacionados à cirurgia de enxerto de biomaterial.

PROCEDIMENTO PLANEJADO

{{treatment.description}}

Região:
{{treatment.teeth}}

Compreendo que o sucesso do tratamento dependerá da resposta biológica do meu organismo, da técnica utilizada e da minha colaboração no cumprimento das prescrições, orientações e retornos.

Fui informado(a) de que procedimentos cirúrgicos podem ocasionar:

• Dor, edema e hematoma;
• Sangramento;
• Infecção;
• Parestesia, anestesia ou hiperalgesia;
• Dormência de lábio, língua, queixo ou dentes;
• Falha de incorporação do enxerto;
• Perda parcial ou total do biomaterial;
• Necessidade de nova intervenção;
• Alteração do plano de tratamento;
• Alteração da previsão orçamentária.

Estou ciente de que o tabagismo pode prejudicar a cicatrização, favorecer infecções e provocar perda do enxerto ou de implantes.

Também fui informado(a) de que algumas instituições podem possuir restrições temporárias para doação de sangue após a realização de enxertos ósseos.

Compreendo que poderá ser necessário aguardar o período de incorporação indicado pelo profissional antes da instalação de implantes.

Fui informado(a) de que o atraso excessivo após o período recomendado poderá favorecer a reabsorção ou perda do enxerto.

Autorizo a realização do procedimento descrito e comprometo-me a seguir todas as orientações profissionais.

DECLARO QUE RECEBI AS EXPLICAÇÕES NECESSÁRIAS, COMPREENDI OS RISCOS E BENEFÍCIOS E TIVE OPORTUNIDADE DE ESCLARECER MINHAS DÚVIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-free-gingival-graft",
      name: "Consentimento para enxerto gengival livre",
      description:
        "Termo de consentimento para cirurgia de enxerto gengival livre.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO PARA CIRURGIA DE ENXERTO GENGIVAL LIVRE

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, declaro que o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, esclareceu os objetivos, riscos, custos e alternativas relacionados à cirurgia de enxerto gengival livre.

PROCEDIMENTO PLANEJADO

{{treatment.description}}

Região:
{{treatment.teeth}}

Compreendo que o sucesso do tratamento dependerá da resposta biológica do meu organismo, da técnica empregada e da minha colaboração durante o pós-operatório.

Fui informado(a) de que o procedimento poderá ocasionar:

• Dor e desconforto;
• Sangramento;
• Edema ou hematoma;
• Infecção;
• Parestesia, anestesia ou hiperalgesia;
• Alterações de sensibilidade;
• Perda parcial ou total do enxerto;
• Alterações estéticas;
• Necessidade de nova intervenção;
• Necessidade de alteração do plano de tratamento.

Estou ciente de que ausências às consultas ou o não cumprimento das orientações poderão prejudicar o resultado.

Fui informado(a) de que o tabagismo pode comprometer a irrigação dos tecidos, impedir o fechamento adequado da região operada, favorecer infecções e provocar perda do enxerto.

Compreendo que poderá haver necessidade de alteração da técnica e da previsão orçamentária conforme a resposta biológica observada.

Autorizo a realização do tratamento descrito e comprometo-me a cumprir as prescrições e orientações fornecidas.

DECLARO QUE RECEBI EXPLICAÇÕES SOBRE A IMPORTÂNCIA, OS RISCOS E OS BENEFÍCIOS DO PROCEDIMENTO E QUE TIVE OPORTUNIDADE DE ESCLARECER TODAS AS MINHAS DÚVIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-connective-tissue-graft",
      name: "Consentimento para enxerto conjuntivo",
      description:
        "Termo de consentimento para cirurgia de enxerto de tecido conjuntivo.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: CREATED_AT,
      content: `CONSENTIMENTO PARA CIRURGIA DE ENXERTO CONJUNTIVO

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, declaro que o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, esclareceu os objetivos, riscos, custos e alternativas relacionados à cirurgia de enxerto conjuntivo.

PROCEDIMENTO PLANEJADO

{{treatment.description}}

Região:
{{treatment.teeth}}

Compreendo que o sucesso do tratamento dependerá da resposta biológica do meu organismo, da técnica empregada e da minha colaboração.

Fui informado(a) de que procedimentos cirúrgicos podem ocasionar:

• Dor e desconforto;
• Sangramento pós-operatório;
• Edema e hematoma;
• Infecção;
• Parestesia, anestesia ou hiperalgesia;
• Alterações de sensibilidade;
• Perda parcial ou total do enxerto;
• Alterações estéticas;
• Necessidade de nova cirurgia;
• Alteração da técnica ou do plano inicialmente proposto.

Estou ciente de que o não comparecimento às consultas e o descumprimento das orientações profissionais poderão prejudicar o resultado.

Fui informado(a) de que o tabagismo pode reduzir a irrigação dos tecidos, prejudicar a cicatrização, favorecer infecções e provocar perda do enxerto.

Compreendo que poderá haver alteração da previsão orçamentária caso sejam necessários procedimentos adicionais.

Autorizo a realização do tratamento descrito e comprometo-me a cumprir as prescrições e orientações fornecidas.

DECLARO QUE RECEBI TODAS AS EXPLICAÇÕES NECESSÁRIAS E QUE TIVE OPORTUNIDADE DE ESCLARECER MINHAS DÚVIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
  ];