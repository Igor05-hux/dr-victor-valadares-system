"use client";

import {
  Copy,
  FilePenLine,
  FileText,
  Filter,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  createDocumentTemplate,
  deleteDocumentTemplate,
  getDocumentTemplates,
  restoreDefaultDocumentTemplate,
  updateDocumentTemplate,
} from "@/services/document-template.service";
import {
  documentTemplateCategoryOptions,
  type CreateDocumentTemplateInput,
  type DocumentTemplate,
  type DocumentTemplateCategory,
} from "@/types/document-template";

type CategoryFilter =
  | "all"
  | DocumentTemplateCategory;

interface TemplateFormState {
  name: string;
  description: string;
  category: DocumentTemplateCategory;
  content: string;
  isActive: boolean;
}

const emptyForm: TemplateFormState = {
  name: "",
  description: "",
  category: "consent",
  content: "",
  isActive: true,
};

function getCategoryLabel(
  category: DocumentTemplateCategory,
): string {
  return (
    documentTemplateCategoryOptions.find(
      (option) =>
        option.value === category,
    )?.label ?? "Outros documentos"
  );
}

export default function DocumentTemplatesPage() {
  const [templates, setTemplates] =
    useState<DocumentTemplate[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);

  const [templateToDelete, setTemplateToDelete] =
    useState<DocumentTemplate | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [form, setForm] =
    useState<TemplateFormState>(emptyForm);

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    async function loadTemplates(): Promise<void> {
      try {
        setIsLoading(true);

        const storedTemplates =
          await getDocumentTemplates();

        setTemplates(storedTemplates);
      } catch (error) {
        toast.error(
          "Não foi possível carregar os modelos.",
          {
            description:
              error instanceof Error
                ? error.message
                : undefined,
          },
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLocaleLowerCase(
        "pt-BR",
      );

    return templates.filter((template) => {
      const matchesCategory =
        categoryFilter === "all" ||
        template.category === categoryFilter;

      const searchableContent = [
        template.name,
        template.description,
        getCategoryLabel(template.category),
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      const matchesSearch =
        normalizedSearch === "" ||
        searchableContent.includes(
          normalizedSearch,
        );

      return matchesCategory && matchesSearch;
    });
  }, [
    categoryFilter,
    searchTerm,
    templates,
  ]);

  function updateField<
    Key extends keyof TemplateFormState,
  >(
    field: Key,
    value: TemplateFormState[Key],
  ): void {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function openCreateForm(): void {
    setSelectedTemplate(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(
    template: DocumentTemplate,
  ): void {
    setSelectedTemplate(template);

    setForm({
      name: template.name,
      description: template.description,
      category: template.category,
      content: template.content,
      isActive: template.isActive,
    });

    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm(): void {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setSelectedTemplate(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function reloadTemplates(): Promise<void> {
    setTemplates(
      await getDocumentTemplates(),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    try {
      setIsSaving(true);
      setFormError("");

      const input: CreateDocumentTemplateInput =
        {
          name: form.name,
          description: form.description,
          category: form.category,
          content: form.content,
          isActive: form.isActive,
        };

      if (selectedTemplate) {
        await updateDocumentTemplate(
          selectedTemplate.id,
          input,
        );

        toast.success(
          "Modelo atualizado com sucesso.",
          {
            description: form.name,
          },
        );
      } else {
        await createDocumentTemplate(input);

        toast.success(
          "Modelo criado com sucesso.",
          {
            description: form.name,
          },
        );
      }

      setIsFormOpen(false);
      setSelectedTemplate(null);
      setForm(emptyForm);

      await reloadTemplates();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o modelo.";

      setFormError(message);

      toast.error(
        "Não foi possível salvar o modelo.",
        {
          description: message,
        },
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRestore(
    template: DocumentTemplate,
  ): Promise<void> {
    try {
      await restoreDefaultDocumentTemplate(
        template.id,
      );

      await reloadTemplates();

      toast.success(
        "Modelo original restaurado.",
        {
          description: template.name,
        },
      );
    } catch (error) {
      toast.error(
        "Não foi possível restaurar o modelo.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    }
  }

  async function handleDuplicate(
    template: DocumentTemplate,
  ): Promise<void> {
    try {
      await createDocumentTemplate({
        name: `${template.name} — Cópia`,
        description: template.description,
        category: template.category,
        content: template.content,
        isActive: template.isActive,
      });

      await reloadTemplates();

      toast.success(
        "Modelo duplicado com sucesso.",
        {
          description: template.name,
        },
      );
    } catch (error) {
      toast.error(
        "Não foi possível duplicar o modelo.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!templateToDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteDocumentTemplate(
        templateToDelete.id,
      );

      toast.success(
        "Modelo excluído com sucesso.",
        {
          description:
            templateToDelete.name,
        },
      );

      setTemplateToDelete(null);

      await reloadTemplates();
    } catch (error) {
      toast.error(
        "Não foi possível excluir o modelo.",
        {
          description:
            error instanceof Error
              ? error.message
              : undefined,
        },
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Modelos de documentos
            </h1>

            <p className="text-sm text-muted-foreground">
              Gerencie contratos, termos,
              atestados e orientações da clínica.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo modelo
          </button>
        </header>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <label className="relative block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Pesquisar modelo..."
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="relative block">
              <Filter
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target
                      .value as CategoryFilter,
                  )
                }
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none"
              >
                <option value="all">
                  Todas as categorias
                </option>

                {documentTemplateCategoryOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>

        {isLoading ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl bg-muted"
                />
              ),
            )}
          </section>
        ) : filteredTemplates.length === 0 ? (
          <section className="rounded-2xl border bg-card p-12 text-center">
            <FileText
              size={42}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-lg font-semibold">
              Nenhum modelo encontrado
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste os filtros ou crie um novo
              modelo.
            </p>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map(
              (template) => (
                <article
                  key={template.id}
                  className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <FileText size={21} />
                    </div>

                    <div className="flex gap-2">
                      {template.isDefault && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          Padrão
                        </span>
                      )}

                      {!template.isActive && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="mt-4 font-bold">
                    {template.name}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {getCategoryLabel(
                      template.category,
                    )}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="mt-auto grid grid-cols-2 gap-2 border-t pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(template)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      <FilePenLine size={16} />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDuplicate(
                          template,
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      <Copy size={16} />
                      Duplicar
                    </button>

                    {template.isDefault ? (
                      <button
                        type="button"
                        onClick={() =>
                          void handleRestore(
                            template,
                          )
                        }
                        className="col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                      >
                        <RotateCcw size={16} />
                        Restaurar original
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setTemplateToDelete(
                            template,
                          )
                        }
                        className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                      >
                        <Trash2 size={16} />
                        Excluir modelo
                      </button>
                    )}
                  </div>
                </article>
              ),
            )}
          </section>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={closeForm}
            aria-label="Fechar formulário"
            className="absolute inset-0"
          />

          <section className="relative z-10 max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-background shadow-2xl">
            <header className="sticky top-0 z-10 flex items-start justify-between border-b bg-background p-6">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedTemplate
                    ? "Editar modelo"
                    : "Novo modelo"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  O conteúdo poderá utilizar variáveis
                  automáticas.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
              >
                <X size={18} />
              </button>
            </header>

            <form
              onSubmit={(event) =>
                void handleSubmit(event)
              }
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">
                    Nome
                  </span>

                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-semibold">
                    Categoria
                  </span>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target
                          .value as DocumentTemplateCategory,
                      )
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none"
                  >
                    {documentTemplateCategoryOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Descrição
                </span>

                <input
                  required
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-blue-600"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Conteúdo
                </span>

                <textarea
                  required
                  rows={24}
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value,
                    )
                  }
                  className="w-full resize-y rounded-xl border bg-background px-4 py-4 font-mono text-sm leading-6 outline-none focus:border-blue-600"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField(
                      "isActive",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Modelo ativo
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Modelos inativos não serão exibidos ao
                    gerar documentos.
                  </p>
                </div>
              </label>

              <footer className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving
                    ? "Salvando..."
                    : "Salvar modelo"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      <ConfirmationDialog
        isOpen={templateToDelete !== null}
        title="Excluir modelo?"
        description={
          templateToDelete
            ? `O modelo “${templateToDelete.name}” será excluído permanentemente.`
            : ""
        }
        confirmLabel="Excluir modelo"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) {
            setTemplateToDelete(null);
          }
        }}
      />
    </DashboardLayout>
  );
}