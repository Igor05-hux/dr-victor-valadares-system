"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { addMedicalHistoryItem } from "@/services/medical-record.service";
import type { MedicalHistoryItem } from "@/types/medical-record";

type MedicalHistoryCategory =
  | "allergies"
  | "conditions"
  | "medications";

interface AddHistoryItemDialogProps {
  patientId: string;
  category: MedicalHistoryCategory;
  label: string;
  onCreated: (item: MedicalHistoryItem) => void;
}

export function AddHistoryItemDialog({
  patientId,
  category,
  label,
  onCreated,
}: AddHistoryItemDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (title.trim().length < 2) {
      toast.error("Informe um título válido.");
      return;
    }

    try {
      setIsSaving(true);

      const newItem = await addMedicalHistoryItem(
        patientId,
        category,
        {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      );

      onCreated(newItem);
      setTitle("");
      setDescription("");

      toast.success(`${label} adicionada com sucesso.`);
    } catch {
      toast.error(`Não foi possível adicionar ${label.toLowerCase()}.`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted">
        <Plus size={16} />
        Adicionar
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Adicionar {label.toLowerCase()}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Título</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-500"
              placeholder={`Informe ${label.toLowerCase()}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Descrição</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:border-blue-500"
              placeholder="Informações adicionais"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving}>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}   