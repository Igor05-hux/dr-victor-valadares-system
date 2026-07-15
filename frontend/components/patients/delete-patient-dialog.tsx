"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePatient } from "@/services/patient.service";

interface DeletePatientDialogProps {
  patientId: string;
  patientName: string;
  onDeleted: (patientId: string) => void;
}

export function DeletePatientDialog({
  patientId,
  patientName,
  onDeleted,
}: DeletePatientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await deletePatient(patientId);
      onDeleted(patientId);

      toast.success("Paciente excluído com sucesso.");
    } catch {
      toast.error("Não foi possível excluir o paciente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
      >
        <Trash2 size={16} />
        Excluir
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir paciente?</AlertDialogTitle>

          <AlertDialogDescription>
            O paciente <strong>{patientName}</strong> será removido da lista.
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Excluindo..." : "Excluir paciente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}