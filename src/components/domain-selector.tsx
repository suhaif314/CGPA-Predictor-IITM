"use client";

import { DegreeDomain } from "@/lib/grading";
import { Database, Cpu } from "lucide-react";

interface DomainSelectorProps {
  value: DegreeDomain;
  onChange: (value: DegreeDomain) => void;
}

const domains = [
  {
    id: "ds" as DegreeDomain,
    label: "Data Science",
    fullLabel: "BS in Data Science and Applications",
    icon: Database,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    activeBg: "bg-blue-100 dark:bg-blue-900/50",
    activeBorder: "border-blue-500 dark:border-blue-400",
    ring: "ring-blue-500/30",
  },
  {
    id: "es" as DegreeDomain,
    label: "Electronic Systems",
    fullLabel: "BS in Electronic Systems",
    icon: Cpu,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
    activeBg: "bg-purple-100 dark:bg-purple-900/50",
    activeBorder: "border-purple-500 dark:border-purple-400",
    ring: "ring-purple-500/30",
  },
];

export function DomainSelector({ value, onChange }: DomainSelectorProps) {
  return (
    <div className="animate-slide-up stagger-1">
      <p className="text-sm font-medium text-muted-foreground mb-2">Degree Program</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {domains.map((d) => {
          const Icon = d.icon;
          const isActive = value === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onChange(d.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                isActive
                  ? `${d.activeBg} ${d.activeBorder} ring-2 ${d.ring} shadow-sm`
                  : `${d.bg} ${d.border} hover:shadow-sm`
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? d.activeBg : d.bg}`}>
                <Icon className={`h-5 w-5 ${d.color}`} />
              </div>
              <div className="min-w-0">
                <div className={`font-semibold text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {d.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">{d.fullLabel}</div>
              </div>
              {isActive && (
                <div className={`ml-auto shrink-0 h-2 w-2 rounded-full ${d.color.replace("text-", "bg-")}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
