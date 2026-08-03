interface PrintDocumentInput {
  title: string;
  content: string;
  patientName: string;
  professionalName: string;
  professionalCro: string;
  clinicName: string;
  clinicCity: string;
  clinicState: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function contentToHtml(content: string): string {
  return escapeHtml(content)
    .split("\n")
    .map((line) => {
      const normalizedLine = line.trim();

      if (!normalizedLine) {
        return "<div class=\"empty-line\"></div>";
      }

      const isTitle =
        normalizedLine === normalizedLine.toUpperCase() &&
        normalizedLine.length > 5 &&
        !normalizedLine.startsWith("_");

      if (isTitle) {
        return `<h2>${normalizedLine}</h2>`;
      }

      if (
        normalizedLine.startsWith("•") ||
        /^\d+[.)]\s/.test(normalizedLine)
      ) {
        return `<p class="list-item">${normalizedLine}</p>`;
      }

      if (normalizedLine.startsWith("_")) {
        return `<p class="signature-line">${normalizedLine}</p>`;
      }

      return `<p>${normalizedLine}</p>`;
    })
    .join("");
}

export function openDocumentForPrint(
  input: PrintDocumentInput,
): void {
  const printWindow = window.open(
    "",
    "_blank",
    "noopener,noreferrer",
  );

  if (!printWindow) {
    throw new Error(
      "O navegador bloqueou a abertura da impressão. Permita pop-ups e tente novamente.",
    );
  }

  const safeTitle = escapeHtml(input.title);
  const safePatientName = escapeHtml(
    input.patientName,
  );
  const safeProfessionalName = escapeHtml(
    input.professionalName,
  );
  const safeProfessionalCro = escapeHtml(
    input.professionalCro,
  );
  const safeClinicName = escapeHtml(
    input.clinicName,
  );
  const safeClinicLocation = escapeHtml(
    `${input.clinicCity} - ${input.clinicState}`,
  );

  const renderedContent = contentToHtml(
    input.content,
  );

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${safeTitle}</title>

        <style>
          @page {
            size: A4;
            margin: 18mm 17mm 20mm;
          }

          * {
            box-sizing: border-box;
          }

          html {
            background: #e4e4e7;
          }

          body {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: #ffffff;
            color: #18181b;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.55;
          }

          .document {
            padding: 18mm 17mm 20mm;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 28px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 16px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .brand-mark {
            display: flex;
            width: 48px;
            height: 48px;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #2563eb;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
          }

          .brand h1 {
            margin: 0;
            font-size: 16pt;
          }

          .brand p,
          .professional p {
            margin: 3px 0 0;
            color: #52525b;
            font-size: 9.5pt;
          }

          .professional {
            text-align: right;
          }

          .document-title {
            margin: 0 0 24px;
            text-align: center;
            font-size: 15pt;
            text-transform: uppercase;
          }

          .patient-reference {
            margin-bottom: 22px;
            border-radius: 8px;
            background: #f4f4f5;
            padding: 10px 12px;
            font-size: 9.5pt;
          }

          .content {
            text-align: justify;
          }

          .content h2 {
            margin: 22px 0 12px;
            font-size: 11.5pt;
            text-align: left;
            break-after: avoid;
          }

          .content p {
            margin: 0 0 10px;
            orphans: 3;
            widows: 3;
          }

          .content .list-item {
            margin-left: 16px;
            text-align: left;
          }

          .empty-line {
            height: 10px;
          }

          .signature-line {
            margin-top: 28px;
            text-align: center;
            white-space: pre-wrap;
          }

          .footer {
            margin-top: 36px;
            border-top: 1px solid #d4d4d8;
            padding-top: 12px;
            color: #71717a;
            font-size: 8.5pt;
            text-align: center;
          }

          .actions {
            position: fixed;
            right: 20px;
            bottom: 20px;
            display: flex;
            gap: 10px;
          }

          .actions button {
            cursor: pointer;
            border: 0;
            border-radius: 10px;
            padding: 12px 18px;
            font-size: 14px;
            font-weight: 600;
          }

          .print-button {
            background: #2563eb;
            color: #ffffff;
          }

          .close-button {
            background: #e4e4e7;
            color: #18181b;
          }

          @media print {
            html,
            body {
              width: auto;
              min-height: auto;
              margin: 0;
              background: #ffffff;
            }

            .document {
              padding: 0;
            }

            .actions {
              display: none;
            }

            .header,
            .patient-reference,
            .footer {
              break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <main class="document">
          <header class="header">
            <div class="brand">
              <div class="brand-mark">VV</div>

              <div>
                <h1>${safeClinicName}</h1>
                <p>Gestão e atendimento odontológico</p>
              </div>
            </div>

            <div class="professional">
              <strong>${safeProfessionalName}</strong>
              <p>CRO-MG ${safeProfessionalCro}</p>
            </div>
          </header>

          <h1 class="document-title">
            ${safeTitle}
          </h1>

          <div class="patient-reference">
            <strong>Paciente:</strong>
            ${safePatientName}
          </div>

          <section class="content">
            ${renderedContent}
          </section>

          <footer class="footer">
            ${safeClinicName} • ${safeClinicLocation}
          </footer>
        </main>

        <div class="actions">
          <button
            type="button"
            class="close-button"
            onclick="window.close()"
          >
            Fechar
          </button>

          <button
            type="button"
            class="print-button"
            onclick="window.print()"
          >
            Imprimir / Salvar PDF
          </button>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}