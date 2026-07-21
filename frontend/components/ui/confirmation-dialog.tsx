"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  LoaderCircle,
  X,
} from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  variant = "danger",
  onConfirm,
  onClose,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow = "";
    };
  }, [isLoading, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const confirmButtonClassName =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-amber-600 text-white hover:bg-amber-700";

  const iconClassName =
    variant === "danger"
      ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
      : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300";

  function handleBackdropClick() {
    if (!isLoading) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border bg-background p-6 shadow-2xl duration-200"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
          >
            <AlertTriangle size={21} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Fechar confirmação"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <h2
            id="confirmation-dialog-title"
            className="text-lg font-bold"
          >
            {title}
          </h2>

          <p
            id="confirmation-dialog-description"
            className="mt-2 text-sm leading-6 text-muted-foreground"
          >
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmButtonClassName}`}
          >
            {isLoading && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {isLoading
              ? "Processando..."
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}