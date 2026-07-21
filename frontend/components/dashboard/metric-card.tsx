  import type { LucideIcon } from "lucide-react";

  interface MetricCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
  }

  export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    iconBg = "bg-blue-50 dark:bg-blue-950",
    iconColor = "text-blue-600",
  }: MetricCardProps) {
    return (
      <article className="rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {value}
            </h3>
          </div>

          <div className={`rounded-xl p-3 ${iconBg}`}>
            <Icon className={iconColor} size={22} />
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {description}
        </p>
      </article>
    );
  }