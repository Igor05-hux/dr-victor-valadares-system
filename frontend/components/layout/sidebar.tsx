"use client";

import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Stethoscope,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
  },
  {
    title: "Pacientes",
    href: "/pacientes",
    icon: Users,
  },
  {
    title: "Prontuários",
    href: "/prontuarios",
    icon: Stethoscope,
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: WalletCards,
  },
  {
    title: "Documentos",
    href: "/documentos",
    icon: FileText,
  },
  {
    title: "WhatsApp",
    href: "/whatsapp",
    icon: MessageCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r bg-white lg:flex dark:bg-zinc-950">
      <div className="flex h-20 items-center border-b px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
          VV
        </div>

        <div className="ml-3">
          <h1 className="font-bold">Dr. Victor Valadares</h1>
          <p className="text-xs text-muted-foreground">
            Gestão Odontológica
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase text-muted-foreground">
          Menu principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={19} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings size={19} />
          Configurações
        </Link>
      </div>
    </aside>
  );
}