"use client";

import {
  FileText,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

interface RecentDashboardDocument {
  id: string;
  title: string;
  patientName: string;
  createdAt: string;
  kind: "generated" | "attached";
}

interface RecentDocumentsProps {
  documents: RecentDashboardDocument[];
  isLoading?: boolean;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function RecentDocuments({
  documents,
  isLoading = false,
}: RecentDocumentsProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">
            Documentos recentes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Últimos documentos emitidos ou anexados.
          </p>
        </div>

        <Link
          href="/documentos"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ),
          )}
        </div>
      ) : documents.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum documento cadastrado.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {documents.map((document) => {
            const Icon =
              document.kind === "generated"
                ? FileText
                : Paperclip;

            return (
              <Link
                key={`${document.kind}-${document.id}`}
                href="/documentos"
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {document.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {document.patientName} •{" "}
                    {formatDate(document.createdAt)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}