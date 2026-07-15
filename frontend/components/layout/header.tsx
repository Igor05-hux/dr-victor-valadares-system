"use client";

import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-6 dark:bg-zinc-950">
      <div>
        <h2 className="text-xl font-bold">Visão geral</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe os principais dados do consultório.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border px-3 md:flex">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="h-10 w-52 bg-transparent text-sm outline-none"
          />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
          aria-label="Notificações"
        >
          <Bell size={19} />
        </button>

        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
            aria-label="Alterar tema"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        )}

        <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            VV
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Victor Valadares</p>
            <p className="text-xs text-muted-foreground">Dentista</p>
          </div>
        </div>
      </div>
    </header>
  );
}