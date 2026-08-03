import type { DocumentTemplate } from "@/types/document-template";

export const defaultDocumentTemplates: DocumentTemplate[] =
  [
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
    {
      id: "template-consent-extraction",
      name: "Consentimento informado de exodontia",
      description:
        "Termo de consentimento para extração de dentes erupcionados, impactados ou semi-impactados.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: "2026-08-02T12:00:00.000Z",
      content: `CONSENTIMENTO INFORMADO DE EXODONTIA

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, autorizo o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, e/ou profissional que esteja trabalhando sob sua responsabilidade, a realizar o seguinte tratamento ou procedimento:

{{treatment.description}}

Autorizo a realização de exodontia de elementos impactados, semi-impactados ou erupcionados, conforme previamente explicado, bem como outros procedimentos considerados necessários para completar o tratamento planejado.

Entendo que o propósito do procedimento é tratar e possivelmente corrigir tecidos doentes na cavidade bucal. Fui informado(a) de que, caso a condição permaneça sem tratamento, poderá ocorrer piora da saúde bucal, incluindo edema, dor, infecção, formação de cistos, neoplasias, doença periodontal, cárie, maloclusão, fratura patológica dos maxilares, perda prematura de dentes e perda óssea.

O Cirurgião-Dentista explicou que existem riscos inerentes e potenciais, incluindo, mas não se limitando a:

• Desconforto pós-operatório, edema e hematoma;
• Sangramento prolongado;
• Lesão em dentes adjacentes, próteses ou restaurações;
• Infecção pós-operatória;
• Restrição temporária da abertura da boca;
• Possibilidade de permanência de fragmento radicular;
• Fratura mandibular;
• Lesão nervosa com dormência ou formigamento;
• Comunicação com seio maxilar ou fossa nasal;
• Necessidade de cirurgia adicional;
• Reações relacionadas a medicamentos, anestésicos ou sedativos.

Fui orientado(a) a não dirigir, trabalhar com máquinas ou consumir bebidas alcoólicas enquanto estiver sob efeito de medicamentos ou anestésicos.

Caso ocorra alguma condição não prevista durante a cirurgia, autorizo o profissional a adotar as medidas consideradas necessárias.

Declaro que não recebi garantia absoluta de sucesso e que compreendo que podem ocorrer insucesso, recidiva, necessidade de retratamento ou agravamento da condição.

Declaro que tive oportunidade de discutir meu histórico médico, fazer perguntas e receber esclarecimentos.

CERTIFICO QUE LI E COMPREENDI O CONTEÚDO DESTE TERMO E QUE TODAS AS MINHAS DÚVIDAS FORAM ESCLARECIDAS.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-implant",
      name: "Consentimento informado de implante",
      description:
        "Termo de consentimento para instalação cirúrgica de implantes dentários.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: "2026-08-02T12:00:00.000Z",
      content: `CONSENTIMENTO INFORMADO DE IMPLANTE

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, concordo com a instalação cirúrgica de implante dentário, conforme explicado pelo Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}.

Procedimento planejado:
{{treatment.description}}

Fui informado(a) de que implantes dentários são estruturas metálicas, normalmente de titânio, posicionadas cirurgicamente no osso maxilar ou mandibular para substituir raízes dentárias e permitir a instalação de próteses.

Compreendo que não existe garantia de permanência definitiva dos implantes e que, em alguns casos, pode ocorrer perda durante ou após o período de osseointegração.

Fui informado(a) de que o sucesso depende, entre outros fatores, de:

• Realização de todas as fases do tratamento;
• Comparecimento às consultas;
• Higiene bucal adequada;
• Cumprimento das orientações profissionais;
• Controle de hábitos parafuncionais;
• Retornos periódicos para manutenção;
• Ausência ou interrupção do tabagismo.

Fui informado(a) sobre riscos e possíveis complicações, incluindo:

• Dor, edema e hematoma;
• Sangramento;
• Infecção pós-operatória;
• Lesão de dentes adjacentes;
• Restrição temporária da abertura da boca;
• Lesão nervosa e alterações de sensibilidade;
• Comunicação com seio maxilar ou fossa nasal;
• Sinusite;
• Falha de integração óssea;
• Fratura de implante ou componente protético;
• Perda ou fratura da prótese;
• Necessidade de procedimentos adicionais;
• Necessidade de manutenção ou substituição de componentes.

Compreendo que hábitos como bruxismo, apertamento, tabagismo, má higienização e mastigação de alimentos excessivamente duros podem reduzir a longevidade do tratamento.

Também compreendo que parafusos e componentes protéticos podem afrouxar ou fraturar e que procedimentos de manutenção poderão gerar custos adicionais.

Autorizo o profissional a realizar procedimentos adicionais que sejam necessários durante o tratamento, caso ocorram condições imprevistas.

Declaro que tive oportunidade de esclarecer minhas dúvidas e que não me foi garantido resultado absoluto.

CERTIFICO QUE LI E COMPREENDI COMPLETAMENTE ESTE TERMO.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-orthodontics",
      name: "Consentimento informado de ortodontia",
      description:
        "Termo de consentimento para instalação e acompanhamento de aparelhos ortodônticos.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: "2026-08-02T12:00:00.000Z",
      content: `CONSENTIMENTO INFORMADO DE ORTODONTIA

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, autorizo a instalação e utilização de aparelhos ortodônticos fixos ou móveis, contenções e demais procedimentos que o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, julgar necessários para atingir os objetivos do plano de tratamento.

Plano de tratamento:
{{treatment.description}}

Entendo que o objetivo do tratamento é alinhar os dentes, corrigir alterações de oclusão, diastemas e desenvolvimento das arcadas, além de melhorar função e estética.

Fui informado(a) de que a ausência de tratamento poderá contribuir para desconforto, doença periodontal, cárie, maloclusão, fratura dentária, perda de dentes ou perda óssea.

Compreendo que o tratamento apresenta riscos, incluindo:

• Cáries e manchas permanentes;
• Reabsorção radicular;
• Comprometimento periodontal e ósseo;
• Fraturas ou perda de elementos dentários;
• Recidiva após o tratamento;
• Disfunções temporomandibulares;
• Irritação, desconforto e inflamação gengival;
• Restrição da abertura da boca;
• Necessidade de procedimentos complementares;
• Necessidade de intervenção cirúrgica.

Declaro estar ciente de que o resultado depende da colaboração do paciente, inclusive comparecimento às consultas, higienização adequada, uso correto de acessórios e cumprimento das orientações.

Estou ciente de que, ao término do tratamento, poderei necessitar de contenções ortodônticas fixas ou móveis e de acompanhamento periódico. Esses itens poderão não estar incluídos no valor do tratamento principal.

Compreendo que a interrupção do tratamento ou a recusa de uso das contenções pode provocar movimentação dos dentes e perda parcial ou total do resultado obtido.

Não me foi garantido resultado absoluto, e compreendo que podem ocorrer insucesso, recidiva ou necessidade de retratamento.

CERTIFICO QUE LI E COMPREENDI O CONTEÚDO DESTE TERMO.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
    {
      id: "template-consent-endodontics",
      name: "Consentimento informado de endodontia",
      description:
        "Termo de consentimento para tratamento de canal e procedimentos complementares.",
      category: "consent",
      isDefault: true,
      isActive: true,
      createdAt: "2026-08-02T12:00:00.000Z",
      content: `CONSENTIMENTO INFORMADO DE ENDODONTIA

Eu, {{patient.name}}, portador(a) do CPF {{patient.cpf}} e RG {{patient.rg}}, autorizo o tratamento endodôntico do(s) elemento(s):

{{treatment.teeth}}

Autorizo também procedimentos complementares que o Cirurgião-Dentista {{professional.name}}, CRO {{professional.cro}}, julgar necessários para atingir os objetivos do plano de tratamento.

Entendo que o tratamento endodôntico tem como objetivo limpar, desinfectar e obturar o sistema de canais radiculares, reduzindo a infecção e promovendo condições para reparo dos tecidos.

Fui informado(a) de que a ausência de tratamento poderá causar dor, infecção, abscesso, fratura, mobilidade, perda dentária, perda óssea e outras complicações.

Compreendo que existem riscos, incluindo:

• Fratura dentária;
• Perfuração do canal;
• Fratura de instrumentos;
• Extravasamento de material obturador;
• Extravasamento de soluções irrigadoras;
• Dor e inflamação pós-operatória;
• Escurecimento do dente;
• Calcificação do canal;
• Infecção persistente;
• Reabsorção radicular;
• Lesão de dentes adjacentes;
• Necessidade de exames complementares;
• Necessidade de retratamento ou cirurgia;
• Possibilidade de perda do elemento dentário.

Estou ciente de que poderá ser necessária tomografia computadorizada ou outro exame de imagem durante o tratamento.

Também fui informado(a) de que, após o término do tratamento de canal, o dente deverá ser restaurado ou reabilitado no prazo indicado pelo profissional. A ausência dessa reabilitação poderá causar fratura ou perda do dente.

Os honorários da restauração, coroa ou outra reabilitação poderão não estar incluídos no tratamento endodôntico.

Declaro estar ciente da necessidade de retornos periódicos para acompanhamento.

Não me foi garantido resultado absoluto e compreendo que pode haver necessidade de retratamento ou procedimento adicional.

CERTIFICO QUE LI E COMPREENDI O CONTEÚDO DESTE TERMO.

{{clinic.city}} - {{clinic.state}}, {{document.fullDate}}.


________________________________________
{{patient.name}}
CPF: {{patient.cpf}}


________________________________________
{{professional.name}}
CRO: {{professional.cro}}`,
    },
];